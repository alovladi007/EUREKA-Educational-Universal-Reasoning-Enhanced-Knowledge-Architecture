#!/bin/bash
#
# Setup automated backups for PostgreSQL, Redis, and MinIO
#

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

NAMESPACE="${1:-eureka}"
BACKUP_NAMESPACE="${2:-eureka-backup}"
ENVIRONMENT="${3:-production}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setting up Backup Strategy${NC}"
echo -e "${GREEN}Namespace: ${NAMESPACE}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Create backup namespace
kubectl create namespace ${BACKUP_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# Create PVC for backups
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: backup-storage
  namespace: ${BACKUP_NAMESPACE}
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
EOF

echo -e "${GREEN}✓ Backup storage created${NC}"
echo ""

# PostgreSQL Backup CronJob
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: ${BACKUP_NAMESPACE}
spec:
  # Run daily at 2 AM UTC
  schedule: "0 2 * * *"
  successfulJobsHistoryLimit: 7
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup
            image: postgres:16
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: eureka-secrets
                  key: POSTGRES_PASSWORD
                  namespace: ${NAMESPACE}
            - name: POSTGRES_HOST
              value: "postgres-service.${NAMESPACE}.svc.cluster.local"
            - name: POSTGRES_DB
              value: "eureka"
            - name: POSTGRES_USER
              value: "eureka"
            - name: BACKUP_DATE
              value: "\$(date +%Y%m%d-%H%M%S)"
            command:
            - /bin/bash
            - -c
            - |
              BACKUP_FILE="/backups/postgres-\${BACKUP_DATE}.sql.gz"
              echo "Starting PostgreSQL backup to \${BACKUP_FILE}..."

              pg_dump -h \${POSTGRES_HOST} -U \${POSTGRES_USER} -d \${POSTGRES_DB} \
                --format=custom --compress=9 | gzip > \${BACKUP_FILE}

              if [ \$? -eq 0 ]; then
                echo "Backup completed successfully"
                # Keep only last 30 days of backups
                find /backups -name "postgres-*.sql.gz" -mtime +30 -delete
                ls -lh \${BACKUP_FILE}
              else
                echo "Backup failed!"
                exit 1
              fi
            volumeMounts:
            - name: backup-storage
              mountPath: /backups
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-storage
EOF

echo -e "${GREEN}✓ PostgreSQL backup job created${NC}"

# Redis Backup CronJob
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: CronJob
metadata:
  name: redis-backup
  namespace: ${BACKUP_NAMESPACE}
spec:
  # Run daily at 3 AM UTC
  schedule: "0 3 * * *"
  successfulJobsHistoryLimit: 7
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup
            image: redis:7-alpine
            env:
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: eureka-secrets
                  key: REDIS_PASSWORD
                  namespace: ${NAMESPACE}
            - name: REDIS_HOST
              value: "redis-service.${NAMESPACE}.svc.cluster.local"
            command:
            - /bin/sh
            - -c
            - |
              BACKUP_FILE="/backups/redis-\$(date +%Y%m%d-%H%M%S).rdb"
              echo "Starting Redis backup to \${BACKUP_FILE}..."

              redis-cli -h \${REDIS_HOST} -a \${REDIS_PASSWORD} --rdb \${BACKUP_FILE}

              if [ \$? -eq 0 ]; then
                echo "Backup completed successfully"
                find /backups -name "redis-*.rdb" -mtime +30 -delete
                ls -lh \${BACKUP_FILE}
              else
                echo "Backup failed!"
                exit 1
              fi
            volumeMounts:
            - name: backup-storage
              mountPath: /backups
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-storage
EOF

echo -e "${GREEN}✓ Redis backup job created${NC}"

# MinIO Backup using mc (MinIO Client)
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: CronJob
metadata:
  name: minio-backup
  namespace: ${BACKUP_NAMESPACE}
spec:
  # Run daily at 4 AM UTC
  schedule: "0 4 * * *"
  successfulJobsHistoryLimit: 7
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup
            image: minio/mc:latest
            env:
            - name: MINIO_ACCESS_KEY
              valueFrom:
                secretKeyRef:
                  name: eureka-secrets
                  key: S3_ACCESS_KEY
                  namespace: ${NAMESPACE}
            - name: MINIO_SECRET_KEY
              valueFrom:
                secretKeyRef:
                  name: eureka-secrets
                  key: S3_SECRET_KEY
                  namespace: ${NAMESPACE}
            - name: MINIO_ENDPOINT
              value: "http://minio-service.${NAMESPACE}.svc.cluster.local:9000"
            command:
            - /bin/sh
            - -c
            - |
              BACKUP_DIR="/backups/minio-\$(date +%Y%m%d-%H%M%S)"
              mkdir -p \${BACKUP_DIR}

              echo "Configuring MinIO client..."
              mc alias set source \${MINIO_ENDPOINT} \${MINIO_ACCESS_KEY} \${MINIO_SECRET_KEY}

              echo "Starting MinIO backup to \${BACKUP_DIR}..."
              mc mirror source/eureka-storage \${BACKUP_DIR}

              if [ \$? -eq 0 ]; then
                echo "Backup completed successfully"
                # Compress backup
                tar -czf \${BACKUP_DIR}.tar.gz -C \${BACKUP_DIR} .
                rm -rf \${BACKUP_DIR}
                # Keep only last 30 days
                find /backups -name "minio-*.tar.gz" -mtime +30 -delete
                ls -lh \${BACKUP_DIR}.tar.gz
              else
                echo "Backup failed!"
                exit 1
              fi
            volumeMounts:
            - name: backup-storage
              mountPath: /backups
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-storage
EOF

echo -e "${GREEN}✓ MinIO backup job created${NC}"
echo ""

# Create manual backup script
cat > manual-backup.sh <<'EOF'
#!/bin/bash
#
# Manual backup script - triggers backup jobs immediately
#

NAMESPACE="eureka-backup"

echo "Creating manual backup jobs..."

# PostgreSQL
kubectl create job --from=cronjob/postgres-backup postgres-backup-manual-$(date +%s) -n ${NAMESPACE}
echo "✓ PostgreSQL backup started"

# Redis
kubectl create job --from=cronjob/redis-backup redis-backup-manual-$(date +%s) -n ${NAMESPACE}
echo "✓ Redis backup started"

# MinIO
kubectl create job --from=cronjob/minio-backup minio-backup-manual-$(date +%s) -n ${NAMESPACE}
echo "✓ MinIO backup started"

echo ""
echo "Monitor backup jobs:"
echo "  kubectl get jobs -n ${NAMESPACE}"
echo "  kubectl logs -f job/<job-name> -n ${NAMESPACE}"
EOF

chmod +x manual-backup.sh

echo -e "${GREEN}✓ Manual backup script created: manual-backup.sh${NC}"
echo ""

# Create restore documentation
cat > RESTORE.md <<EOF
# EUREKA Platform - Backup and Restore Guide

## Backup Schedule

Automated backups run daily:
- PostgreSQL: 2:00 AM UTC
- Redis: 3:00 AM UTC
- MinIO: 4:00 AM UTC

Retention: 30 days

## Manual Backup

Trigger immediate backup:

\`\`\`bash
./manual-backup.sh
\`\`\`

## Restore PostgreSQL

1. List available backups:
\`\`\`bash
kubectl exec -it -n ${BACKUP_NAMESPACE} <backup-pod> -- ls -lh /backups
\`\`\`

2. Copy backup file locally:
\`\`\`bash
kubectl cp ${BACKUP_NAMESPACE}/<pod>:/backups/postgres-YYYYMMDD-HHMMSS.sql.gz ./postgres-backup.sql.gz
\`\`\`

3. Restore to database:
\`\`\`bash
# Create restore pod
kubectl run postgres-restore --image=postgres:16 --rm -it --restart=Never \\
  --env="PGPASSWORD=\$(kubectl get secret eureka-secrets -n ${NAMESPACE} -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d)" \\
  -- bash

# Inside the pod
pg_restore -h postgres-service.${NAMESPACE}.svc.cluster.local \\
  -U eureka -d eureka --clean --if-exists \\
  < postgres-backup.sql.gz
\`\`\`

4. Or use kubectl exec:
\`\`\`bash
gunzip -c postgres-backup.sql.gz | kubectl exec -i -n ${NAMESPACE} deployment/postgres -- \\
  psql -U eureka -d eureka
\`\`\`

## Restore Redis

1. Get backup file:
\`\`\`bash
kubectl cp ${BACKUP_NAMESPACE}/<pod>:/backups/redis-YYYYMMDD-HHMMSS.rdb ./dump.rdb
\`\`\`

2. Stop Redis:
\`\`\`bash
kubectl scale deployment redis -n ${NAMESPACE} --replicas=0
\`\`\`

3. Copy backup to Redis pod:
\`\`\`bash
kubectl cp ./dump.rdb ${NAMESPACE}/<redis-pod>:/data/dump.rdb
\`\`\`

4. Start Redis:
\`\`\`bash
kubectl scale deployment redis -n ${NAMESPACE} --replicas=1
\`\`\`

## Restore MinIO

1. Extract backup:
\`\`\`bash
kubectl cp ${BACKUP_NAMESPACE}/<pod>:/backups/minio-YYYYMMDD-HHMMSS.tar.gz ./minio-backup.tar.gz
tar -xzf minio-backup.tar.gz
\`\`\`

2. Restore using mc:
\`\`\`bash
mc alias set target http://minio-service.${NAMESPACE}.svc.cluster.local:9000 \\
  \${MINIO_ACCESS_KEY} \${MINIO_SECRET_KEY}

mc mirror ./backup-contents target/eureka-storage
\`\`\`

## Disaster Recovery

### Full System Restore

1. Deploy fresh cluster
2. Apply all Kubernetes manifests
3. Restore databases in order:
   - PostgreSQL (core data)
   - Redis (cache - optional)
   - MinIO (files)

### Point-in-Time Recovery

PostgreSQL supports PITR with WAL archiving. To enable:

1. Configure continuous archiving in PostgreSQL
2. Store WAL files in external storage (S3)
3. Use pg_basebackup for base backups

## Backup to External Storage

### AWS S3
\`\`\`bash
aws s3 sync /backups s3://eureka-backups-\${ENVIRONMENT}/
\`\`\`

### GCP Cloud Storage
\`\`\`bash
gsutil -m rsync -r /backups gs://eureka-backups-\${ENVIRONMENT}/
\`\`\`

### Azure Blob Storage
\`\`\`bash
az storage blob upload-batch -d eureka-backups -s /backups
\`\`\`

## Monitoring Backups

Check backup jobs:
\`\`\`bash
kubectl get cronjobs -n ${BACKUP_NAMESPACE}
kubectl get jobs -n ${BACKUP_NAMESPACE}
\`\`\`

View backup logs:
\`\`\`bash
kubectl logs -n ${BACKUP_NAMESPACE} job/postgres-backup-<timestamp>
\`\`\`

Set up alerts for failed backups in Prometheus.

## Testing Backups

Regularly test restore procedures:

1. Monthly: Restore to test environment
2. Quarterly: Full disaster recovery drill
3. Annually: Multi-region failover test

## Backup Verification

\`\`\`bash
# Check backup file integrity
kubectl exec -it -n ${BACKUP_NAMESPACE} <pod> -- \\
  sh -c 'md5sum /backups/postgres-*.sql.gz > /backups/checksums.txt'
\`\`\`
EOF

cat RESTORE.md

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Backup Strategy Configured!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo "Backup Schedule:"
echo "  PostgreSQL: Daily at 2:00 AM UTC (retention: 30 days)"
echo "  Redis:      Daily at 3:00 AM UTC (retention: 30 days)"
echo "  MinIO:      Daily at 4:00 AM UTC (retention: 30 days)"
echo ""
echo "Backup Storage:"
echo "  PVC: backup-storage (100Gi) in namespace ${BACKUP_NAMESPACE}"
echo ""
echo "Next steps:"
echo "  1. Review RESTORE.md for restore procedures"
echo "  2. Test restore process in non-production environment"
echo "  3. Configure external backup storage (S3, GCS, Azure Blob)"
echo "  4. Set up monitoring alerts for backup failures"
echo "  5. Schedule regular restore drills"
echo ""
echo "Manual backup:"
echo "  ./manual-backup.sh"
echo ""
echo "Monitor backups:"
echo "  kubectl get cronjobs -n ${BACKUP_NAMESPACE}"
echo "  kubectl logs -f -n ${BACKUP_NAMESPACE} job/<job-name>"
