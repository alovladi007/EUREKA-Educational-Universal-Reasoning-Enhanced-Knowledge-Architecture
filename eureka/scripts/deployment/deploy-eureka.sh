#!/bin/bash
#
# EUREKA Platform - Complete Deployment Script
# Deploys infrastructure and application to Kubernetes
#

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

ENVIRONMENT="${1:-production}"
NAMESPACE="eureka"
DRY_RUN="${DRY_RUN:-false}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}EUREKA Platform Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Namespace: ${NAMESPACE}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print step
step() {
    echo -e "${YELLOW}▶ $1${NC}"
}

# Function to print success
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check required tools
step "Checking required tools..."
command -v kubectl >/dev/null 2>&1 || { error "kubectl is required but not installed. Aborting."; exit 1; }
command -v helm >/dev/null 2>&1 || { error "Helm is required but not installed. Aborting."; exit 1; }
success "All required tools are installed"
echo ""

# Verify kubectl context
step "Verifying Kubernetes context..."
CURRENT_CONTEXT=$(kubectl config current-context)
echo "Current context: ${CURRENT_CONTEXT}"
read -p "Is this the correct cluster? (yes/no): " -n 3 -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    error "Deployment cancelled"
    exit 1
fi
success "Kubernetes context verified"
echo ""

# Create namespace
step "Creating namespace..."
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
success "Namespace ${NAMESPACE} ready"
echo ""

# Label namespace
kubectl label namespace ${NAMESPACE} environment=${ENVIRONMENT} --overwrite
kubectl label namespace ${NAMESPACE} istio-injection=enabled --overwrite || true

# Install NGINX Ingress Controller
step "Installing NGINX Ingress Controller..."
if ! kubectl get namespace ingress-nginx >/dev/null 2>&1; then
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update

    helm install ingress-nginx ingress-nginx/ingress-nginx \
      --namespace ingress-nginx \
      --create-namespace \
      --set controller.replicaCount=2 \
      --set controller.nodeSelector."kubernetes\.io/os"=linux \
      --set defaultBackend.nodeSelector."kubernetes\.io/os"=linux \
      --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"="nlb" \
      --wait

    success "NGINX Ingress Controller installed"
else
    success "NGINX Ingress Controller already installed"
fi
echo ""

# Wait for LoadBalancer IP
step "Waiting for LoadBalancer IP..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

EXTERNAL_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [ -z "${EXTERNAL_IP}" ]; then
    EXTERNAL_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
fi

if [ -n "${EXTERNAL_IP}" ]; then
    success "LoadBalancer IP/Hostname: ${EXTERNAL_IP}"
    echo ""
    echo -e "${YELLOW}⚠️  Configure DNS records to point to: ${EXTERNAL_IP}${NC}"
    echo ""
else
    error "LoadBalancer IP not available yet. Please check the service."
fi

# Check for secrets
step "Checking for secrets..."
if ! kubectl get secret eureka-secrets -n ${NAMESPACE} >/dev/null 2>&1; then
    error "eureka-secrets not found!"
    echo ""
    echo "Please create secrets first:"
    echo "  cd eureka/scripts/secrets"
    echo "  ./generate-secrets.sh ${ENVIRONMENT}"
    echo "  kubectl apply -f secrets-${ENVIRONMENT}/eureka-secrets.yaml"
    echo ""
    exit 1
fi
success "Secrets found"
echo ""

# Deploy infrastructure (PostgreSQL, Redis, MinIO)
step "Deploying infrastructure..."

# Add Bitnami Helm repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Deploy PostgreSQL with pgvector
cat > postgres-values.yaml <<EOF
global:
  postgresql:
    auth:
      existingSecret: eureka-secrets
      secretKeys:
        adminPasswordKey: POSTGRES_PASSWORD
        userPasswordKey: POSTGRES_PASSWORD

primary:
  persistence:
    enabled: true
    size: ${POSTGRES_SIZE:-20Gi}
  resources:
    requests:
      memory: "512Mi"
      cpu: "250m"
    limits:
      memory: "2Gi"
      cpu: "1000m"

image:
  registry: docker.io
  repository: pgvector/pgvector
  tag: pg16

metrics:
  enabled: true
  serviceMonitor:
    enabled: true
EOF

helm upgrade --install postgres bitnami/postgresql \
  --namespace ${NAMESPACE} \
  --values postgres-values.yaml \
  --wait \
  --timeout 10m

success "PostgreSQL deployed"

# Deploy Redis
cat > redis-values.yaml <<EOF
auth:
  enabled: true
  existingSecret: eureka-secrets
  existingSecretPasswordKey: REDIS_PASSWORD

master:
  persistence:
    enabled: true
    size: ${REDIS_SIZE:-10Gi}
  resources:
    requests:
      memory: "256Mi"
      cpu: "100m"
    limits:
      memory: "1Gi"
      cpu: "500m"

metrics:
  enabled: true
  serviceMonitor:
    enabled: true
EOF

helm upgrade --install redis bitnami/redis \
  --namespace ${NAMESPACE} \
  --values redis-values.yaml \
  --wait \
  --timeout 10m

success "Redis deployed"
echo ""

# Deploy MinIO
step "Deploying MinIO..."
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minio
  namespace: ${NAMESPACE}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: minio
  template:
    metadata:
      labels:
        app: minio
    spec:
      containers:
      - name: minio
        image: minio/minio:latest
        args:
        - server
        - /data
        - --console-address
        - ":9001"
        env:
        - name: MINIO_ROOT_USER
          valueFrom:
            secretKeyRef:
              name: eureka-secrets
              key: S3_ACCESS_KEY
        - name: MINIO_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: eureka-secrets
              key: S3_SECRET_KEY
        ports:
        - containerPort: 9000
        - containerPort: 9001
        volumeMounts:
        - name: storage
          mountPath: /data
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: minio-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: minio-pvc
  namespace: ${NAMESPACE}
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: ${MINIO_SIZE:-50Gi}
---
apiVersion: v1
kind: Service
metadata:
  name: minio-service
  namespace: ${NAMESPACE}
spec:
  type: ClusterIP
  ports:
  - port: 9000
    targetPort: 9000
    name: api
  - port: 9001
    targetPort: 9001
    name: console
  selector:
    app: minio
EOF

success "MinIO deployed"
echo ""

# Deploy EUREKA application with Helm
step "Deploying EUREKA application..."

cd ../../helm/eureka-platform

# Select values file based on environment
VALUES_FILE="values-${ENVIRONMENT}.yaml"
if [ ! -f "${VALUES_FILE}" ]; then
    VALUES_FILE="values.yaml"
fi

# Build Docker images or use pre-built
if [ "${BUILD_IMAGES:-false}" = "true" ]; then
    step "Building Docker images..."
    # Build and push images
    cd ../../../
    for service in api-core tutor-llm assess; do
        docker build -t eureka/${service}:${ENVIRONMENT} ./eureka/services/${service}
        docker tag eureka/${service}:${ENVIRONMENT} eureka/${service}:latest
        # Push to registry if configured
        if [ -n "${DOCKER_REGISTRY:-}" ]; then
            docker tag eureka/${service}:${ENVIRONMENT} ${DOCKER_REGISTRY}/eureka/${service}:${ENVIRONMENT}
            docker push ${DOCKER_REGISTRY}/eureka/${service}:${ENVIRONMENT}
        fi
    done
    cd eureka/scripts/deployment
    success "Docker images built"
fi

# Deploy with Helm
helm upgrade --install eureka ../../helm/eureka-platform \
  --namespace ${NAMESPACE} \
  --values ../../helm/eureka-platform/${VALUES_FILE} \
  --set global.environment=${ENVIRONMENT} \
  --set apiCore.image.tag=${IMAGE_TAG:-latest} \
  --set tutorLLM.image.tag=${IMAGE_TAG:-latest} \
  --set assessmentEngine.image.tag=${IMAGE_TAG:-latest} \
  --wait \
  --timeout 15m

success "EUREKA application deployed"
echo ""

# Run database migrations
step "Running database migrations..."
kubectl create job --from=cronjob/db-migrate db-migrate-$(date +%s) -n ${NAMESPACE} || true
kubectl wait --for=condition=complete --timeout=5m job/db-migrate-$(date +%s) -n ${NAMESPACE} || true

success "Database migrations completed"
echo ""

# Display deployment status
step "Deployment Status"
echo ""
kubectl get pods -n ${NAMESPACE}
echo ""
kubectl get svc -n ${NAMESPACE}
echo ""
kubectl get ingress -n ${NAMESPACE}
echo ""

# Display access information
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Access Information:${NC}"
echo ""

if [ -n "${EXTERNAL_IP}" ]; then
    echo "LoadBalancer IP: ${EXTERNAL_IP}"
    echo ""
    echo "Configure your DNS:"
    echo "  @ A ${EXTERNAL_IP}"
    echo "  api A ${EXTERNAL_IP}"
    echo "  app A ${EXTERNAL_IP}"
    echo ""
fi

echo "Endpoints (after DNS configuration):"
echo "  API: https://api.eureka.example.com"
echo "  App: https://app.eureka.example.com"
echo "  Health: https://api.eureka.example.com/health"
echo ""

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure DNS records"
echo "2. Wait for TLS certificates to be issued"
echo "3. Run smoke tests: ../smoke-tests/run-tests.sh"
echo "4. Monitor logs: kubectl logs -f deployment/api-core -n ${NAMESPACE}"
echo "5. Setup monitoring: ../monitoring/setup-monitoring.sh"
echo ""
