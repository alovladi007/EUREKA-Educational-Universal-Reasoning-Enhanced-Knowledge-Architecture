#!/bin/bash
#
# EUREKA Platform - Secrets Generation Script
#
# This script generates secure secrets for production deployment
# Usage: ./generate-secrets.sh <environment>
# Example: ./generate-secrets.sh production
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="${1:-production}"
NAMESPACE="eureka"
OUTPUT_DIR="./secrets-${ENVIRONMENT}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}EUREKA Secrets Generation${NC}"
echo -e "${GREEN}Environment: ${ENVIRONMENT}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Create output directory
mkdir -p "${OUTPUT_DIR}"

# Function to generate random string
generate_secret() {
    local length=${1:-32}
    openssl rand -base64 ${length} | tr -d "=+/" | cut -c1-${length}
}

# Function to generate hex string
generate_hex() {
    local length=${1:-32}
    openssl rand -hex ${length}
}

echo -e "${YELLOW}Generating secrets...${NC}"

# Generate JWT Secret (64 characters for extra security)
JWT_SECRET=$(generate_hex 64)
echo "✓ JWT_SECRET generated (128 characters)"

# Generate Session Secret
SESSION_SECRET=$(generate_hex 32)
echo "✓ SESSION_SECRET generated (64 characters)"

# Generate Database Password
DB_PASSWORD=$(generate_secret 32)
echo "✓ POSTGRES_PASSWORD generated"

# Generate Redis Password
REDIS_PASSWORD=$(generate_secret 32)
echo "✓ REDIS_PASSWORD generated"

# Generate MinIO Credentials
MINIO_ACCESS_KEY="eureka-$(generate_secret 16)"
MINIO_SECRET_KEY=$(generate_secret 32)
echo "✓ MinIO credentials generated"

# Generate Encryption Key for sensitive data
ENCRYPTION_KEY=$(generate_hex 32)
echo "✓ ENCRYPTION_KEY generated"

echo ""
echo -e "${GREEN}Secrets generated successfully!${NC}"
echo ""

# Create .env file
cat > "${OUTPUT_DIR}/.env" <<EOF
# EUREKA Platform Secrets
# Environment: ${ENVIRONMENT}
# Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
#
# ⚠️  IMPORTANT: Keep this file secure and never commit to version control!
#

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Session Secret
SESSION_SECRET=${SESSION_SECRET}

# Database
POSTGRES_USER=eureka
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=eureka
DATABASE_URL=postgresql://eureka:${DB_PASSWORD}@postgres-service.${NAMESPACE}.svc.cluster.local:5432/eureka

# Redis
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_URL=redis://:${REDIS_PASSWORD}@redis-service.${NAMESPACE}.svc.cluster.local:6379/0

# MinIO (S3-compatible storage)
S3_ACCESS_KEY=${MINIO_ACCESS_KEY}
S3_SECRET_KEY=${MINIO_SECRET_KEY}
S3_ENDPOINT=http://minio-service.${NAMESPACE}.svc.cluster.local:9000
S3_BUCKET=eureka-storage

# Encryption
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# SMTP Configuration (Update with your actual values)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@eureka.example.com
SMTP_FROM_NAME=EUREKA Platform

# API Keys (Update with your actual values)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Sentry (Error Tracking)
SENTRY_DSN=https://...@sentry.io/...

# Feature Flags
ENABLE_RATE_LIMITING=true
ENABLE_AUDIT_LOGGING=true
ENABLE_EMAIL_VERIFICATION=true
FERPA_ENABLED=true
COPPA_ENABLED=true
GDPR_ENABLED=true
EOF

echo -e "${GREEN}✓ Secrets saved to: ${OUTPUT_DIR}/.env${NC}"

# Create Kubernetes secret YAML
cat > "${OUTPUT_DIR}/eureka-secrets.yaml" <<EOF
# EUREKA Platform Kubernetes Secrets
# Environment: ${ENVIRONMENT}
# Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
#
# Apply with: kubectl apply -f eureka-secrets.yaml -n ${NAMESPACE}
#

apiVersion: v1
kind: Secret
metadata:
  name: eureka-secrets
  namespace: ${NAMESPACE}
  labels:
    app: eureka
    environment: ${ENVIRONMENT}
type: Opaque
stringData:
  # JWT Configuration
  JWT_SECRET: "${JWT_SECRET}"
  JWT_ALGORITHM: "HS256"
  ACCESS_TOKEN_EXPIRE_MINUTES: "30"
  REFRESH_TOKEN_EXPIRE_DAYS: "7"

  # Session
  SESSION_SECRET: "${SESSION_SECRET}"

  # Database
  POSTGRES_USER: "eureka"
  POSTGRES_PASSWORD: "${DB_PASSWORD}"
  POSTGRES_DB: "eureka"
  DATABASE_URL: "postgresql://eureka:${DB_PASSWORD}@postgres-service.${NAMESPACE}.svc.cluster.local:5432/eureka"

  # Redis
  REDIS_PASSWORD: "${REDIS_PASSWORD}"
  REDIS_URL: "redis://:${REDIS_PASSWORD}@redis-service.${NAMESPACE}.svc.cluster.local:6379/0"

  # MinIO
  S3_ACCESS_KEY: "${MINIO_ACCESS_KEY}"
  S3_SECRET_KEY: "${MINIO_SECRET_KEY}"
  S3_ENDPOINT: "http://minio-service.${NAMESPACE}.svc.cluster.local:9000"
  S3_BUCKET: "eureka-storage"

  # Encryption
  ENCRYPTION_KEY: "${ENCRYPTION_KEY}"

  # SMTP (Update these values!)
  SMTP_HOST: "smtp.gmail.com"
  SMTP_PORT: "587"
  SMTP_USERNAME: "your-email@gmail.com"
  SMTP_PASSWORD: "your-app-password"
  SMTP_FROM_EMAIL: "noreply@eureka.example.com"
  SMTP_FROM_NAME: "EUREKA Platform"
EOF

echo -e "${GREEN}✓ Kubernetes secret saved to: ${OUTPUT_DIR}/eureka-secrets.yaml${NC}"

# Create secrets summary
cat > "${OUTPUT_DIR}/SECRETS_SUMMARY.txt" <<EOF
EUREKA Platform - Secrets Summary
Environment: ${ENVIRONMENT}
Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")

========================================
SECRETS GENERATED
========================================

✓ JWT_SECRET (128 chars)
✓ SESSION_SECRET (64 chars)
✓ POSTGRES_PASSWORD (32 chars)
✓ REDIS_PASSWORD (32 chars)
✓ MINIO_ACCESS_KEY
✓ MINIO_SECRET_KEY (32 chars)
✓ ENCRYPTION_KEY (64 chars)

========================================
NEXT STEPS
========================================

1. Review the generated secrets in .env file

2. Update SMTP configuration with your actual email service credentials:
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USERNAME
   - SMTP_PASSWORD
   - SMTP_FROM_EMAIL

3. Add API keys for AI services:
   - OPENAI_API_KEY (for GPT models)
   - ANTHROPIC_API_KEY (for Claude models)

4. (Optional) Add Sentry DSN for error tracking:
   - SENTRY_DSN

5. Apply secrets to Kubernetes:
   kubectl apply -f ${OUTPUT_DIR}/eureka-secrets.yaml -n ${NAMESPACE}

6. Verify secrets:
   kubectl get secrets -n ${NAMESPACE}
   kubectl describe secret eureka-secrets -n ${NAMESPACE}

========================================
SECURITY REMINDERS
========================================

⚠️  NEVER commit secrets to version control!
⚠️  Add ${OUTPUT_DIR}/ to .gitignore
⚠️  Store secrets in a secure password manager
⚠️  Rotate secrets regularly (every 90 days recommended)
⚠️  Use external secrets operator for production:
    - HashiCorp Vault
    - AWS Secrets Manager
    - Azure Key Vault
    - GCP Secret Manager

========================================
BACKUP INSTRUCTIONS
========================================

1. Backup secrets to secure location:
   # Encrypt with GPG
   gpg --symmetric --cipher-algo AES256 ${OUTPUT_DIR}/.env

   # Store encrypted file in secure location
   # Delete unencrypted file
   rm ${OUTPUT_DIR}/.env

2. To restore:
   gpg --decrypt ${OUTPUT_DIR}/.env.gpg > .env

========================================
EOF

cat "${OUTPUT_DIR}/SECRETS_SUMMARY.txt"

# Create .gitignore entry
if [ ! -f .gitignore ] || ! grep -q "secrets-" .gitignore; then
    echo "" >> .gitignore
    echo "# Generated secrets" >> .gitignore
    echo "secrets-*/" >> .gitignore
    echo "*.env" >> .gitignore
    echo -e "${GREEN}✓ Added secrets to .gitignore${NC}"
fi

echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}⚠️  IMPORTANT SECURITY NOTICE${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "The secrets directory contains sensitive information!"
echo ""
echo "1. Review and update the SMTP and API key values"
echo "2. Apply the secrets to your Kubernetes cluster"
echo "3. Backup the secrets to a secure location"
echo "4. Delete the local secrets directory after backup"
echo ""
echo -e "${RED}NEVER commit the ${OUTPUT_DIR}/ directory!${NC}"
echo ""
