#!/bin/bash
#
# Setup complete monitoring stack: Prometheus, Grafana, Alertmanager, Loki
#

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

NAMESPACE="${1:-monitoring}"
ENVIRONMENT="${2:-production}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setting up Monitoring Stack${NC}"
echo -e "${GREEN}Namespace: ${NAMESPACE}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Create monitoring namespace
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# Add Helm repositories
echo "Adding Helm repositories..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

echo -e "${GREEN}✓ Helm repositories added${NC}"
echo ""

# Install kube-prometheus-stack (Prometheus + Grafana + Alertmanager)
echo "Installing kube-prometheus-stack..."

cat > prometheus-values.yaml <<EOF
prometheus:
  prometheusSpec:
    retention: 30d
    storageSpec:
      volumeClaimTemplate:
        spec:
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 50Gi

    # Service monitors for EUREKA services
    serviceMonitorSelector:
      matchLabels:
        app.kubernetes.io/part-of: eureka

    # Additional scrape configs
    additionalScrapeConfigs:
    - job_name: 'eureka-api-core'
      kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
          - eureka
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: api-core
      - source_labels: [__address__]
        action: replace
        target_label: __address__
        regex: ([^:]+)(?::\d+)?
        replacement: \$1:8000

grafana:
  adminPassword: "admin"  # Change this!

  persistence:
    enabled: true
    size: 10Gi

  datasources:
    datasources.yaml:
      apiVersion: 1
      datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus-operated:9090
        access: proxy
        isDefault: true
      - name: Loki
        type: loki
        url: http://loki:3100
        access: proxy

  dashboardProviders:
    dashboardproviders.yaml:
      apiVersion: 1
      providers:
      - name: 'default'
        orgId: 1
        folder: ''
        type: file
        disableDeletion: false
        editable: true
        options:
          path: /var/lib/grafana/dashboards/default

  dashboards:
    default:
      eureka-api:
        gnetId: 7587
        revision: 1
        datasource: Prometheus
      kubernetes-cluster:
        gnetId: 7249
        revision: 1
        datasource: Prometheus
      node-exporter:
        gnetId: 1860
        revision: 27
        datasource: Prometheus

alertmanager:
  config:
    global:
      resolve_timeout: 5m

    route:
      group_by: ['alertname', 'cluster', 'service']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 12h
      receiver: 'default'
      routes:
      - match:
          severity: critical
        receiver: 'critical'
      - match:
          severity: warning
        receiver: 'warning'

    receivers:
    - name: 'default'
      # Configure your notification channel
      # webhook_configs:
      # - url: 'http://example.com/webhook'

    - name: 'critical'
      # Slack, PagerDuty, email, etc.
      # slack_configs:
      # - api_url: 'YOUR_SLACK_WEBHOOK_URL'
      #   channel: '#alerts-critical'
      #   text: '{{ .CommonAnnotations.description }}'

    - name: 'warning'
      # slack_configs:
      # - api_url: 'YOUR_SLACK_WEBHOOK_URL'
      #   channel: '#alerts-warning'

# Service monitors
prometheus-node-exporter:
  enabled: true

kube-state-metrics:
  enabled: true
EOF

helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace ${NAMESPACE} \
  --values prometheus-values.yaml \
  --wait \
  --timeout 10m

echo -e "${GREEN}✓ kube-prometheus-stack installed${NC}"
echo ""

# Install Loki for log aggregation
echo "Installing Loki..."

cat > loki-values.yaml <<EOF
loki:
  auth_enabled: false

  storage:
    type: filesystem

  schemaConfig:
    configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

persistence:
  enabled: true
  size: 50Gi

serviceMonitor:
  enabled: true
EOF

helm upgrade --install loki grafana/loki \
  --namespace ${NAMESPACE} \
  --values loki-values.yaml \
  --wait

echo -e "${GREEN}✓ Loki installed${NC}"
echo ""

# Install Promtail for log collection
echo "Installing Promtail..."

cat > promtail-values.yaml <<EOF
config:
  lokiAddress: http://loki:3100/loki/api/v1/push

  snippets:
    extraScrapeConfigs: |
      - job_name: kubernetes-pods
        kubernetes_sd_configs:
        - role: pod
        relabel_configs:
        - source_labels: [__meta_kubernetes_pod_namespace]
          target_label: namespace
        - source_labels: [__meta_kubernetes_pod_name]
          target_label: pod
        - source_labels: [__meta_kubernetes_pod_container_name]
          target_label: container
EOF

helm upgrade --install promtail grafana/promtail \
  --namespace ${NAMESPACE} \
  --values promtail-values.yaml \
  --wait

echo -e "${GREEN}✓ Promtail installed${NC}"
echo ""

# Create ServiceMonitor for EUREKA services
echo "Creating ServiceMonitors for EUREKA..."

kubectl apply -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: eureka-api-core
  namespace: eureka
  labels:
    app.kubernetes.io/part-of: eureka
spec:
  selector:
    matchLabels:
      app: api-core
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: eureka-tutor-llm
  namespace: eureka
  labels:
    app.kubernetes.io/part-of: eureka
spec:
  selector:
    matchLabels:
      app: tutor-llm
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
EOF

echo -e "${GREEN}✓ ServiceMonitors created${NC}"
echo ""

# Import EUREKA dashboard
echo "Importing EUREKA dashboard..."

kubectl create configmap eureka-dashboard \
  --from-file=../../monitoring/grafana/dashboard-api-overview.json \
  -n ${NAMESPACE} \
  --dry-run=client -o yaml | kubectl apply -f -

echo -e "${GREEN}✓ Dashboard imported${NC}"
echo ""

# Setup port forwarding
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Monitoring Stack Installed!${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo "Access Dashboards:"
echo ""
echo "Grafana:"
echo "  kubectl port-forward -n ${NAMESPACE} svc/kube-prometheus-stack-grafana 3000:80"
echo "  http://localhost:3000"
echo "  Username: admin"
echo "  Password: admin (change this!)"
echo ""
echo "Prometheus:"
echo "  kubectl port-forward -n ${NAMESPACE} svc/prometheus-operated 9090:9090"
echo "  http://localhost:9090"
echo ""
echo "Alertmanager:"
echo "  kubectl port-forward -n ${NAMESPACE} svc/alertmanager-operated 9093:9093"
echo "  http://localhost:9093"
echo ""

# Create alerts configuration
cat > eureka-alerts.yaml <<EOF
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: eureka-alerts
  namespace: ${NAMESPACE}
  labels:
    prometheus: kube-prometheus-stack-prometheus
    role: alert-rules
spec:
  groups:
  - name: eureka
    interval: 30s
    rules:

    # High Error Rate
    - alert: HighErrorRate
      expr: |
        rate(http_requests_total{namespace="eureka",status=~"5.."}[5m]) > 0.05
      for: 5m
      labels:
        severity: warning
        component: api
      annotations:
        summary: "High error rate detected"
        description: "Error rate is {{ \$value }} on {{ \$labels.instance }}"

    # High API Latency
    - alert: HighAPILatency
      expr: |
        histogram_quantile(0.95,
          rate(http_request_duration_seconds_bucket{namespace="eureka"}[5m])
        ) > 1.0
      for: 5m
      labels:
        severity: warning
        component: api
      annotations:
        summary: "High API latency detected"
        description: "95th percentile latency is {{ \$value }}s on {{ \$labels.pod }}"

    # Pod Restarts
    - alert: PodRestartingFrequently
      expr: |
        rate(kube_pod_container_status_restarts_total{namespace="eureka"}[15m]) > 0.1
      for: 5m
      labels:
        severity: critical
        component: infrastructure
      annotations:
        summary: "Pod restarting frequently"
        description: "Pod {{ \$labels.pod }} is restarting {{ \$value }} times per minute"

    # High CPU Usage
    - alert: HighCPUUsage
      expr: |
        rate(container_cpu_usage_seconds_total{namespace="eureka",container!=""}[5m]) > 0.8
      for: 10m
      labels:
        severity: warning
        component: infrastructure
      annotations:
        summary: "High CPU usage"
        description: "CPU usage is {{ \$value }} on {{ \$labels.pod }}"

    # High Memory Usage
    - alert: HighMemoryUsage
      expr: |
        (container_memory_usage_bytes{namespace="eureka"} / container_spec_memory_limit_bytes{namespace="eureka"}) > 0.9
      for: 5m
      labels:
        severity: critical
        component: infrastructure
      annotations:
        summary: "High memory usage"
        description: "Memory usage is {{ \$value | humanizePercentage }} on {{ \$labels.pod }}"

    # Database Connection Pool
    - alert: DatabaseConnectionPoolLow
      expr: |
        (db_connections_active / db_connections_max) > 0.8
      for: 5m
      labels:
        severity: warning
        component: database
      annotations:
        summary: "Database connection pool running low"
        description: "{{ \$value | humanizePercentage }} of connections in use"

    # Service Down
    - alert: ServiceDown
      expr: up{namespace="eureka"} == 0
      for: 2m
      labels:
        severity: critical
        component: infrastructure
      annotations:
        summary: "Service is down"
        description: "{{ \$labels.job }} on {{ \$labels.instance }} is down"
EOF

kubectl apply -f eureka-alerts.yaml

echo -e "${GREEN}✓ Alert rules configured${NC}"
echo ""

echo "Verify monitoring:"
echo "  kubectl get pods -n ${NAMESPACE}"
echo "  kubectl get servicemonitors -n eureka"
echo "  kubectl get prometheusrules -n ${NAMESPACE}"
