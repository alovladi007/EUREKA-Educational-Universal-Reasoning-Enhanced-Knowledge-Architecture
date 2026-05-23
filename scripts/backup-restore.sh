#!/usr/bin/env bash
# Phase 20 — Postgres backup + restore script for EUREKA production.
#
# Designed to run inside a Kubernetes CronJob (postgres:16 image) with
# `eureka-secrets` mounted. Pushes pg_dump output to S3, retains 30 days.
#
# Usage:
#   backup-restore.sh backup           # take a snapshot
#   backup-restore.sh restore <s3-key> # restore from a specific snapshot
#   backup-restore.sh list             # list available snapshots
#   backup-restore.sh test             # round-trip test (backup → scratch DB → verify)
#
# Required env (typically from kubectl create secret generic eureka-secrets):
#   DATABASE_URL       — postgresql://user:pass@host:5432/eureka
#   AWS_ACCESS_KEY_ID  — for s3 push/pull
#   AWS_SECRET_ACCESS_KEY
#   AWS_REGION         — e.g. us-east-1
#   S3_BACKUP_BUCKET   — e.g. eureka-prod-backups
# Optional:
#   RETENTION_DAYS     — defaults to 30
#   SLACK_WEBHOOK_URL  — notify on failure

set -euo pipefail

CMD="${1:-help}"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
S3_BUCKET="${S3_BACKUP_BUCKET:?S3_BACKUP_BUCKET not set}"
DB_URL="${DATABASE_URL:?DATABASE_URL not set}"

# -- helpers ------------------------------------------------------------------

log() { echo "[backup-restore $(date -u +%FT%TZ)] $*" >&2; }

slack_fail() {
  if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
    curl -sS -X POST -H 'content-type: application/json' \
      --data "{\"text\":\":rotating_light: EUREKA backup-restore FAILED at $TS — $1\"}" \
      "$SLACK_WEBHOOK_URL" >/dev/null || true
  fi
}

trap 'slack_fail "Script exited unexpectedly"' ERR

# -- backup -------------------------------------------------------------------

do_backup() {
  local out="/tmp/eureka-${TS}.dump"
  local s3_key="postgres/eureka-${TS}.dump"

  log "starting pg_dump → $out"
  pg_dump --format=custom --no-owner --no-privileges --compress=9 \
    --file="$out" "$DB_URL"

  local size; size=$(stat -c '%s' "$out" 2>/dev/null || stat -f '%z' "$out")
  log "pg_dump complete: ${size} bytes"

  log "uploading to s3://${S3_BUCKET}/${s3_key}"
  aws s3 cp "$out" "s3://${S3_BUCKET}/${s3_key}" \
    --storage-class STANDARD_IA \
    --metadata "ts=${TS},source=eureka-prod"

  rm -f "$out"

  log "expiring backups older than ${RETENTION_DAYS} days"
  aws s3 ls "s3://${S3_BUCKET}/postgres/" | while read -r line; do
    local fdate; fdate=$(echo "$line" | awk '{print $1}')
    local fname; fname=$(echo "$line" | awk '{print $4}')
    if [[ -n "$fdate" && -n "$fname" ]]; then
      local age; age=$(( ( $(date +%s) - $(date -d "$fdate" +%s 2>/dev/null || echo 0) ) / 86400 ))
      if (( age > RETENTION_DAYS )); then
        log "  deleting old backup: $fname (age ${age}d)"
        aws s3 rm "s3://${S3_BUCKET}/postgres/${fname}"
      fi
    fi
  done

  log "backup ok: s3://${S3_BUCKET}/${s3_key}"
}

# -- restore ------------------------------------------------------------------

do_restore() {
  local s3_key="${2:?usage: restore <s3-key>}"
  local local_file="/tmp/$(basename "$s3_key")"

  log "downloading s3://${S3_BUCKET}/${s3_key} → $local_file"
  aws s3 cp "s3://${S3_BUCKET}/${s3_key}" "$local_file"

  log "restoring into $DB_URL"
  log "  (this DROPs existing schema — Ctrl-C in 10s to abort)"
  sleep 10

  pg_restore --clean --if-exists --no-owner --no-privileges \
    --dbname="$DB_URL" --verbose "$local_file"

  rm -f "$local_file"
  log "restore ok"
}

# -- list ---------------------------------------------------------------------

do_list() {
  log "available snapshots in s3://${S3_BUCKET}/postgres/:"
  aws s3 ls "s3://${S3_BUCKET}/postgres/" | sort
}

# -- test (drill) -------------------------------------------------------------

do_test() {
  local snap; snap=$(aws s3 ls "s3://${S3_BUCKET}/postgres/" | sort | tail -1 | awk '{print $4}')
  if [[ -z "$snap" ]]; then
    log "ERROR: no snapshots to test against"
    exit 1
  fi
  log "drilling restore from: $snap"
  log "  (this restores into a scratch DB, not prod)"

  local scratch_db="eureka_restore_drill_${TS}"
  local pg_admin_url; pg_admin_url=$(echo "$DB_URL" | sed -E 's#/[^/]+$#/postgres#')

  log "creating scratch DB: $scratch_db"
  psql "$pg_admin_url" -c "CREATE DATABASE \"$scratch_db\";"

  local scratch_url; scratch_url=$(echo "$DB_URL" | sed -E "s#/[^/]+\$#/$scratch_db#")
  aws s3 cp "s3://${S3_BUCKET}/postgres/${snap}" "/tmp/${snap}"
  pg_restore --clean --if-exists --no-owner --no-privileges \
    --dbname="$scratch_url" "/tmp/${snap}"

  log "verifying schema on scratch DB"
  psql "$scratch_url" -c "SELECT COUNT(*) FROM users;" || { log "FAIL"; exit 1; }
  psql "$scratch_url" -c "SELECT COUNT(*) FROM activity_events;" || { log "FAIL"; exit 1; }

  log "drill ok — dropping scratch DB"
  psql "$pg_admin_url" -c "DROP DATABASE \"$scratch_db\";"
  rm -f "/tmp/${snap}"
}

# -- dispatch -----------------------------------------------------------------

case "$CMD" in
  backup)  do_backup ;;
  restore) do_restore "$@" ;;
  list)    do_list ;;
  test)    do_test ;;
  *)
    cat <<USAGE >&2
EUREKA backup-restore.sh
  backup          take a snapshot, upload to S3, expire old
  restore <key>   restore from a specific S3 key
  list            list available snapshots
  test            drill: restore the latest into a scratch DB and verify

Required env: DATABASE_URL, S3_BACKUP_BUCKET, AWS_REGION (+ AWS creds)
USAGE
    exit 2
    ;;
esac
