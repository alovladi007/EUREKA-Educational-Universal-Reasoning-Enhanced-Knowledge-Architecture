#!/bin/bash
#
# Setup External Secrets Operator for production
# Supports AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, HashiCorp Vault
#

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROVIDER="${1:-aws}"
NAMESPACE="eureka"

echo -e "${GREEN}Installing External Secrets Operator...${NC}"

# Install External Secrets Operator via Helm
helm repo add external-secrets https://charts.external-secrets.io
helm repo update

helm install external-secrets \
  external-secrets/external-secrets \
  -n external-secrets-system \
  --create-namespace \
  --set installCRDs=true

echo -e "${GREEN}✓ External Secrets Operator installed${NC}"

# Wait for operator to be ready
kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/name=external-secrets \
  -n external-secrets-system \
  --timeout=300s

echo ""
echo -e "${YELLOW}Creating SecretStore configuration...${NC}"

case "${PROVIDER}" in
  aws)
    cat > external-secrets-aws.yaml <<EOF
# AWS Secrets Manager SecretStore
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secretsmanager
  namespace: ${NAMESPACE}
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:
          serviceAccountRef:
            name: eureka-api
---
# External Secret
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: eureka-secrets
  namespace: ${NAMESPACE}
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secretsmanager
    kind: SecretStore
  target:
    name: eureka-secrets
    creationPolicy: Owner
  data:
  - secretKey: JWT_SECRET
    remoteRef:
      key: eureka/production/jwt
      property: secret
  - secretKey: DATABASE_URL
    remoteRef:
      key: eureka/production/database
      property: url
  - secretKey: REDIS_URL
    remoteRef:
      key: eureka/production/redis
      property: url
  - secretKey: OPENAI_API_KEY
    remoteRef:
      key: eureka/production/openai
      property: api_key
  - secretKey: ANTHROPIC_API_KEY
    remoteRef:
      key: eureka/production/anthropic
      property: api_key
EOF
    echo -e "${GREEN}✓ AWS Secrets Manager configuration created${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Create secrets in AWS Secrets Manager"
    echo "2. Setup IRSA (IAM Roles for Service Accounts)"
    echo "3. Apply: kubectl apply -f external-secrets-aws.yaml"
    ;;

  gcp)
    cat > external-secrets-gcp.yaml <<EOF
# GCP Secret Manager SecretStore
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: gcp-secretmanager
  namespace: ${NAMESPACE}
spec:
  provider:
    gcpsm:
      projectID: "your-project-id"
      auth:
        workloadIdentity:
          clusterLocation: us-central1
          clusterName: eureka-cluster
          serviceAccountRef:
            name: eureka-api
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: eureka-secrets
  namespace: ${NAMESPACE}
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: gcp-secretmanager
    kind: SecretStore
  target:
    name: eureka-secrets
    creationPolicy: Owner
  data:
  - secretKey: JWT_SECRET
    remoteRef:
      key: eureka-jwt-secret
  - secretKey: DATABASE_URL
    remoteRef:
      key: eureka-database-url
  - secretKey: REDIS_URL
    remoteRef:
      key: eureka-redis-url
EOF
    echo -e "${GREEN}✓ GCP Secret Manager configuration created${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Create secrets in GCP Secret Manager"
    echo "2. Setup Workload Identity"
    echo "3. Apply: kubectl apply -f external-secrets-gcp.yaml"
    ;;

  azure)
    cat > external-secrets-azure.yaml <<EOF
# Azure Key Vault SecretStore
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: azure-keyvault
  namespace: ${NAMESPACE}
spec:
  provider:
    azurekv:
      vaultUrl: "https://eureka-vault.vault.azure.net"
      authType: WorkloadIdentity
      serviceAccountRef:
        name: eureka-api
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: eureka-secrets
  namespace: ${NAMESPACE}
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: azure-keyvault
    kind: SecretStore
  target:
    name: eureka-secrets
    creationPolicy: Owner
  data:
  - secretKey: JWT_SECRET
    remoteRef:
      key: jwt-secret
  - secretKey: DATABASE_URL
    remoteRef:
      key: database-url
EOF
    echo -e "${GREEN}✓ Azure Key Vault configuration created${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Create secrets in Azure Key Vault"
    echo "2. Setup Workload Identity"
    echo "3. Apply: kubectl apply -f external-secrets-azure.yaml"
    ;;

  vault)
    cat > external-secrets-vault.yaml <<EOF
# HashiCorp Vault SecretStore
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: ${NAMESPACE}
spec:
  provider:
    vault:
      server: "http://vault.vault.svc.cluster.local:8200"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "eureka-role"
          serviceAccountRef:
            name: eureka-api
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: eureka-secrets
  namespace: ${NAMESPACE}
spec:
  refreshInterval: 15m
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: eureka-secrets
    creationPolicy: Owner
  data:
  - secretKey: JWT_SECRET
    remoteRef:
      key: eureka/production
      property: jwt_secret
  - secretKey: DATABASE_URL
    remoteRef:
      key: eureka/production
      property: database_url
EOF
    echo -e "${GREEN}✓ HashiCorp Vault configuration created${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Install Vault in cluster or connect to external Vault"
    echo "2. Configure Kubernetes auth in Vault"
    echo "3. Create secrets in Vault"
    echo "4. Apply: kubectl apply -f external-secrets-vault.yaml"
    ;;

  *)
    echo "Unknown provider: ${PROVIDER}"
    echo "Usage: $0 [aws|gcp|azure|vault]"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}External Secrets Operator setup complete!${NC}"
