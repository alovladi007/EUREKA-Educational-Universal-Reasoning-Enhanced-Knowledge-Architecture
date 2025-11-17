#!/bin/bash
#
# EUREKA Platform - Kubernetes Cluster Setup
# Supports AWS EKS, GCP GKE, Azure AKS
#

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROVIDER="${1:-}"
ENVIRONMENT="${2:-production}"
CLUSTER_NAME="eureka-${ENVIRONMENT}"

if [ -z "${PROVIDER}" ]; then
    echo "Usage: $0 <provider> [environment]"
    echo "Providers: aws, gcp, azure, local"
    echo "Example: $0 aws production"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}EUREKA Kubernetes Cluster Setup${NC}"
echo -e "${GREEN}Provider: ${PROVIDER}${NC}"
echo -e "${GREEN}Environment: ${ENVIRONMENT}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

case "${PROVIDER}" in
  aws)
    echo -e "${YELLOW}Setting up AWS EKS cluster...${NC}"

    # Check for required tools
    command -v aws >/dev/null 2>&1 || { echo "aws CLI is required but not installed. Aborting." >&2; exit 1; }
    command -v eksctl >/dev/null 2>&1 || { echo "eksctl is required but not installed. Aborting." >&2; exit 1; }

    REGION="${AWS_REGION:-us-east-1}"

    # Create EKS cluster configuration
    cat > eks-cluster.yaml <<EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: ${CLUSTER_NAME}
  region: ${REGION}
  version: "1.28"
  tags:
    Environment: ${ENVIRONMENT}
    Project: EUREKA
    ManagedBy: eksctl

iam:
  withOIDC: true
  serviceAccounts:
  - metadata:
      name: eureka-api
      namespace: eureka
    wellKnownPolicies:
      externalDNS: true
      certManager: true
    attachPolicyARNs:
    - arn:aws:iam::aws:policy/AmazonS3FullAccess
    - arn:aws:iam::aws:policy/SecretsManagerReadWrite

managedNodeGroups:
  - name: eureka-workers
    instanceType: t3.large
    desiredCapacity: 3
    minSize: 3
    maxSize: 10
    volumeSize: 50
    privateNetworking: true
    labels:
      role: worker
      environment: ${ENVIRONMENT}
    tags:
      k8s.io/cluster-autoscaler/enabled: "true"
      k8s.io/cluster-autoscaler/${CLUSTER_NAME}: "owned"
    iam:
      withAddonPolicies:
        imageBuilder: true
        autoScaler: true
        externalDNS: true
        certManager: true
        albIngress: true
        ebs: true
        efs: true

addons:
  - name: vpc-cni
    version: latest
  - name: coredns
    version: latest
  - name: kube-proxy
    version: latest
  - name: aws-ebs-csi-driver
    version: latest
    wellKnownPolicies:
      ebsCSIController: true
EOF

    echo -e "${GREEN}✓ EKS cluster configuration created${NC}"
    echo ""
    echo "Creating EKS cluster (this will take 15-20 minutes)..."

    eksctl create cluster -f eks-cluster.yaml

    echo -e "${GREEN}✓ EKS cluster created${NC}"

    # Configure kubectl context
    aws eks update-kubeconfig --region ${REGION} --name ${CLUSTER_NAME}

    # Install AWS Load Balancer Controller
    echo "Installing AWS Load Balancer Controller..."
    helm repo add eks https://aws.github.io/eks-charts
    helm repo update

    helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
      -n kube-system \
      --set clusterName=${CLUSTER_NAME} \
      --set serviceAccount.create=false \
      --set serviceAccount.name=aws-load-balancer-controller

    # Enable cluster autoscaler
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml

    echo -e "${GREEN}✓ AWS infrastructure components installed${NC}"
    ;;

  gcp)
    echo -e "${YELLOW}Setting up GCP GKE cluster...${NC}"

    command -v gcloud >/dev/null 2>&1 || { echo "gcloud CLI is required but not installed. Aborting." >&2; exit 1; }

    PROJECT_ID="${GCP_PROJECT_ID:-}"
    REGION="${GCP_REGION:-us-central1}"
    ZONE="${GCP_ZONE:-us-central1-a}"

    if [ -z "${PROJECT_ID}" ]; then
        echo -e "${RED}Error: GCP_PROJECT_ID environment variable is required${NC}"
        exit 1
    fi

    # Create GKE cluster
    gcloud container clusters create ${CLUSTER_NAME} \
      --project=${PROJECT_ID} \
      --zone=${ZONE} \
      --machine-type=n1-standard-4 \
      --num-nodes=3 \
      --enable-autoscaling \
      --min-nodes=3 \
      --max-nodes=10 \
      --enable-autorepair \
      --enable-autoupgrade \
      --enable-ip-alias \
      --network=default \
      --subnetwork=default \
      --addons=HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver \
      --workload-pool=${PROJECT_ID}.svc.id.goog \
      --enable-shielded-nodes \
      --shielded-secure-boot \
      --shielded-integrity-monitoring \
      --labels=environment=${ENVIRONMENT},project=eureka

    # Get credentials
    gcloud container clusters get-credentials ${CLUSTER_NAME} --zone=${ZONE} --project=${PROJECT_ID}

    echo -e "${GREEN}✓ GKE cluster created${NC}"
    ;;

  azure)
    echo -e "${YELLOW}Setting up Azure AKS cluster...${NC}"

    command -v az >/dev/null 2>&1 || { echo "Azure CLI is required but not installed. Aborting." >&2; exit 1; }

    RESOURCE_GROUP="eureka-${ENVIRONMENT}-rg"
    LOCATION="${AZURE_LOCATION:-eastus}"

    # Create resource group
    az group create --name ${RESOURCE_GROUP} --location ${LOCATION}

    # Create AKS cluster
    az aks create \
      --resource-group ${RESOURCE_GROUP} \
      --name ${CLUSTER_NAME} \
      --node-count 3 \
      --enable-cluster-autoscaler \
      --min-count 3 \
      --max-count 10 \
      --node-vm-size Standard_D4s_v3 \
      --enable-managed-identity \
      --enable-addons monitoring \
      --generate-ssh-keys \
      --network-plugin azure \
      --enable-oidc-issuer \
      --enable-workload-identity \
      --tags Environment=${ENVIRONMENT} Project=EUREKA

    # Get credentials
    az aks get-credentials --resource-group ${RESOURCE_GROUP} --name ${CLUSTER_NAME}

    echo -e "${GREEN}✓ AKS cluster created${NC}"
    ;;

  local)
    echo -e "${YELLOW}Setting up local Kubernetes cluster...${NC}"

    # Check for available local Kubernetes options
    if command -v kind >/dev/null 2>&1; then
        echo "Using kind (Kubernetes in Docker)..."

        cat > kind-config.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: ${CLUSTER_NAME}
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
- role: worker
- role: worker
EOF

        kind create cluster --config kind-config.yaml

        # Install NGINX Ingress for kind
        kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

    elif command -v minikube >/dev/null 2>&1; then
        echo "Using minikube..."

        minikube start \
          --cpus=4 \
          --memory=8192 \
          --disk-size=50g \
          --driver=docker \
          --kubernetes-version=v1.28.0

        # Enable addons
        minikube addons enable ingress
        minikube addons enable metrics-server

    else
        echo -e "${RED}Error: Neither kind nor minikube found. Please install one of them.${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Local cluster created${NC}"
    ;;

  *)
    echo -e "${RED}Unknown provider: ${PROVIDER}${NC}"
    echo "Supported providers: aws, gcp, azure, local"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Cluster Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Verify cluster
echo "Verifying cluster..."
kubectl cluster-info
kubectl get nodes

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Install cert-manager: ./setup-cert-manager.sh"
echo "2. Install monitoring: ./setup-monitoring.sh"
echo "3. Generate secrets: ../secrets/generate-secrets.sh ${ENVIRONMENT}"
echo "4. Deploy EUREKA: ./deploy-eureka.sh ${ENVIRONMENT}"
