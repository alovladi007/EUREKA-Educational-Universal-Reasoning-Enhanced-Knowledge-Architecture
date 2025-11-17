#!/bin/bash
#
# Setup cert-manager and configure TLS certificates
#

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DOMAIN="${1:-eureka.example.com}"
EMAIL="${2:-admin@${DOMAIN}}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installing cert-manager${NC}"
echo -e "${GREEN}Domain: ${DOMAIN}${NC}"
echo -e "${GREEN}Email: ${EMAIL}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Install cert-manager
echo "Installing cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for cert-manager to be ready
echo "Waiting for cert-manager to be ready..."
kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/instance=cert-manager \
  -n cert-manager \
  --timeout=300s

echo -e "${GREEN}✓ cert-manager installed${NC}"
echo ""

# Create ClusterIssuer for Let's Encrypt Production
cat > letsencrypt-prod.yaml <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ${EMAIL}
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          class: nginx
    - dns01:
        cloudflare:
          email: ${EMAIL}
          apiTokenSecretRef:
            name: cloudflare-api-token
            key: api-token
      selector:
        dnsZones:
        - ${DOMAIN}
EOF

# Create ClusterIssuer for Let's Encrypt Staging (for testing)
cat > letsencrypt-staging.yaml <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: ${EMAIL}
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

echo "Creating ClusterIssuers..."
kubectl apply -f letsencrypt-staging.yaml
kubectl apply -f letsencrypt-prod.yaml

echo -e "${GREEN}✓ ClusterIssuers created${NC}"
echo ""

# Create Certificate resource
cat > eureka-certificate.yaml <<EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: eureka-tls
  namespace: eureka
spec:
  secretName: eureka-tls-cert
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  commonName: ${DOMAIN}
  dnsNames:
  - ${DOMAIN}
  - api.${DOMAIN}
  - app.${DOMAIN}
  - www.${DOMAIN}
  - "*.${DOMAIN}"
EOF

echo -e "${YELLOW}Certificate configuration created: eureka-certificate.yaml${NC}"
echo ""

# Create DNS setup guide
cat > DNS_SETUP.md <<EOF
# DNS Setup Guide for EUREKA Platform

## Required DNS Records

Add the following DNS records to your DNS provider:

### If using LoadBalancer (AWS/GCP/Azure)

First, get your LoadBalancer IP/hostname:

\`\`\`bash
# Wait for LoadBalancer to be provisioned
kubectl get svc -n ingress-nginx ingress-nginx-controller

# Get the EXTERNAL-IP
EXTERNAL_IP=\$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
# Or for AWS (returns hostname)
EXTERNAL_HOSTNAME=\$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
\`\`\`

### DNS Records to Add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A (or CNAME) | @ | <EXTERNAL-IP or HOSTNAME> | 300 |
| A (or CNAME) | api | <EXTERNAL-IP or HOSTNAME> | 300 |
| A (or CNAME) | app | <EXTERNAL-IP or HOSTNAME> | 300 |
| A (or CNAME) | www | <EXTERNAL-IP or HOSTNAME> | 300 |

### Example with Cloudflare

1. Log in to Cloudflare dashboard
2. Select your domain
3. Go to DNS settings
4. Add records:

\`\`\`
Type: A
Name: @
IPv4 address: <your-load-balancer-ip>
Proxy status: Proxied (orange cloud)
TTL: Auto

Type: A
Name: api
IPv4 address: <your-load-balancer-ip>
Proxy status: Proxied
TTL: Auto

Type: A
Name: app
IPv4 address: <your-load-balancer-ip>
Proxy status: Proxied
TTL: Auto
\`\`\`

### Verify DNS Propagation

\`\`\`bash
# Check DNS resolution
nslookup ${DOMAIN}
nslookup api.${DOMAIN}
nslookup app.${DOMAIN}

# Or use dig
dig ${DOMAIN} +short
dig api.${DOMAIN} +short
\`\`\`

## Apply Certificate

After DNS records are configured and propagated:

\`\`\`bash
# Create namespace if not exists
kubectl create namespace eureka --dry-run=client -o yaml | kubectl apply -f -

# Apply certificate
kubectl apply -f eureka-certificate.yaml

# Check certificate status
kubectl get certificate -n eureka
kubectl describe certificate eureka-tls -n eureka

# View certificate details
kubectl get secret eureka-tls-cert -n eureka -o yaml
\`\`\`

## Troubleshooting

### Certificate not issuing

Check cert-manager logs:
\`\`\`bash
kubectl logs -n cert-manager deploy/cert-manager
\`\`\`

Check certificate events:
\`\`\`bash
kubectl describe certificate eureka-tls -n eureka
kubectl describe certificaterequest -n eureka
kubectl describe order -n eureka
kubectl describe challenge -n eureka
\`\`\`

### DNS validation failing

1. Ensure DNS records are correct
2. Wait for DNS propagation (can take up to 48 hours, usually 5-10 minutes)
3. Check if firewall allows HTTP traffic on port 80 for HTTP-01 challenge

### Rate limits

Let's Encrypt has rate limits:
- 50 certificates per registered domain per week
- 5 duplicate certificates per week

Use staging issuer for testing:
\`\`\`yaml
issuerRef:
  name: letsencrypt-staging  # Use this for testing
  kind: ClusterIssuer
\`\`\`

## Using Cloudflare DNS for validation (Recommended for wildcard certs)

1. Create Cloudflare API token:
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create token with "Zone:DNS:Edit" permissions

2. Create Kubernetes secret:
\`\`\`bash
kubectl create secret generic cloudflare-api-token \\
  --from-literal=api-token=<your-cloudflare-api-token> \\
  -n cert-manager
\`\`\`

3. Certificate will use DNS-01 challenge automatically

## Alternative: AWS Route53

\`\`\`yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ${EMAIL}
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - dns01:
        route53:
          region: us-east-1
      selector:
        dnsZones:
        - ${DOMAIN}
\`\`\`

Requires IAM policy for Route53 attached to service account.
EOF

cat DNS_SETUP.md

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}cert-manager setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review DNS_SETUP.md for DNS configuration instructions"
echo "2. Configure DNS records at your DNS provider"
echo "3. Wait for DNS propagation"
echo "4. Apply certificate: kubectl apply -f eureka-certificate.yaml"
echo "5. Verify: kubectl get certificate -n eureka"
