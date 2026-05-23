#!/usr/bin/env bash
# Atomic prod-web restart for the local Next.js bundle on :4040.
#
# Why: this dance is easy to get wrong manually. Concurrent next-server
# processes + a fresh `npm run build` racing each other has wiped
# .next/server/ multiple times in this repo (manifests as "Internal
# Server Error" / "Cannot find module .../app/dashboard/page.js" 500s
# in production after what should have been a healthy build).
#
# This script enforces:
#   1. NO next-server is running before the build starts
#   2. .next is wiped from a known-quiescent state
#   3. The build runs to completion (rc must be 0)
#   4. The new prod server starts only after the build is fully on disk
#   5. We wait for the server to respond before declaring success
#
# Usage: scripts/restart-prod-web.sh
set -euo pipefail

WEB_DIR="$(cd "$(dirname "$0")/.." && pwd)/eureka/apps/web"
PORT="${PORT:-4040}"
LOG="${LOG:-/tmp/eureka-web-${PORT}.log}"

cd "$WEB_DIR"

log() { printf "[restart-prod-web] %s\n" "$*"; }

# 1. Kill ALL next-servers + anything holding the port.
log "killing any prior next-server processes…"
ps -ef | awk '/next-server/ && !/awk/ {print $2}' | xargs -I{} kill -9 {} 2>/dev/null || true
lsof -ti tcp:"$PORT" 2>/dev/null | xargs -I{} kill -9 {} 2>/dev/null || true

# 2. Wait for the port to be truly free.
for _ in $(seq 1 10); do
  if ! lsof -ti tcp:"$PORT" >/dev/null 2>&1; then break; fi
  sleep 1
done

# 3. Wipe .next from a quiescent state.
log "wiping .next…"
chmod -R u+w .next 2>/dev/null || true
rm -rf .next 2>/dev/null || true

# 4. Build (rc must be 0).
log "building (npm run build)…"
if ! npm run build > "$LOG.build" 2>&1; then
  log "BUILD FAILED — last 40 lines:"
  tail -40 "$LOG.build" >&2
  exit 1
fi
log "build ok ($(wc -l < "$LOG.build") log lines)"

# 5. Sanity: server-side chunks for the home page must exist.
if [ ! -f .next/server/app/page.js ] && [ ! -f .next/server/app/dashboard/page.js ]; then
  log "POST-BUILD CHECK FAILED — .next/server/app/{,dashboard/}page.js missing"
  ls .next/server/app/ 2>&1 | head -20 >&2 || true
  exit 1
fi

# 6. Start the new prod server.
log "starting prod (PORT=$PORT)…"
PORT="$PORT" nohup npm start > "$LOG" 2>&1 &
SERVER_PID=$!
disown

# 7. Wait for it to actually respond before claiming success.
log "waiting for HTTP 200 on /dashboard…"
for i in $(seq 1 30); do
  code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}/dashboard" 2>/dev/null || echo "000")
  if [ "$code" = "200" ]; then
    log "✓ prod up on :$PORT (server pid $SERVER_PID, build $(cat .next/BUILD_ID))"
    log "  log: $LOG"
    exit 0
  fi
  sleep 1
done

log "✗ prod did not return 200 in 30s. Last 20 log lines:"
tail -20 "$LOG" >&2
exit 1
