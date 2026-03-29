#!/bin/sh
set -e

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/go/bin:/go/bin:/root/go/bin:/root/.local/share/corepack"

echo "=========================================="
echo "  Etheria Times - Services Starting"
echo "  - Frontend: http://localhost:3000"
echo "  - API:      http://localhost:8080"
echo "  - DB:       db:5432 (via Docker network)"
echo "=========================================="
echo ""

echo "[*] Starting Next.js on :3000..."
cd /app/app
corepack pnpm dev -H 0.0.0.0 &
NEXT_PID=$!

echo "[*] Waiting for Next.js to be ready..."
sleep 5

echo "[*] Starting Go API server on :8080..."
cd /app
air -c /app/.air.toml &
API_PID=$!

echo "[*] All services started! Press Ctrl+C to stop"
echo ""

cleanup() {
    echo "[*] Stopping services..."
    kill $API_PID $NEXT_PID 2>/dev/null
    wait $API_PID $NEXT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

wait
