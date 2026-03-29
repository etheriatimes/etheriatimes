#!/bin/sh
set -e

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/go/bin:/go/bin:/root/go/bin:/root/.local/share/corepack"

echo "=========================================="
echo "  Etheria Times - Production Services"
echo "  - Frontend: http://localhost:3000"
echo "  - API:      http://localhost:8080"
echo "  - DB:       db:5432 (via Docker network)"
echo "=========================================="
echo ""

echo "[*] Fixing pnpm..."
rm -f /usr/local/bin/pnpm
npm install -g pnpm@9.15.4

echo "[*] Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
until PGPASSWORD="${DB_PASSWORD:-password}" psql -h db -U aether -d etheria_account -c '\q' 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "[!] Database not available after $MAX_RETRIES attempts, continuing anyway..."
        break
    fi
    echo "[*] Waiting for database... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if PGPASSWORD="${DB_PASSWORD:-password}" psql -h db -U aether -d etheria_account -c '\q' 2>/dev/null; then
    echo "[*] Database connected, initializing tables..."
    
    PGPASSWORD="${DB_PASSWORD:-password}" psql -h db -U aether -d etheria_account <<-EOSQL
		CREATE TABLE IF NOT EXISTS users (
		    id VARCHAR(255) PRIMARY KEY,
		    email VARCHAR(255) UNIQUE NOT NULL,
		    password_hash VARCHAR(255),
		    first_name VARCHAR(255),
		    last_name VARCHAR(255),
		    phone VARCHAR(50),
		    avatar_url TEXT,
		    role VARCHAR(50) DEFAULT 'USER',
		    is_active BOOLEAN DEFAULT true,
		    email_verified TIMESTAMP,
		    created_at TIMESTAMP DEFAULT NOW(),
		    updated_at TIMESTAMP DEFAULT NOW()
		);
	EOSQL
    
    echo "[✓] Database tables initialized"
else
    echo "[!] Database not available, running in mock mode"
fi

echo "[*] Starting Next.js on :3000..."
cd /app/app
pnpm next start -p 3000 -H 0.0.0.0 &
NEXT_PID=$!

echo "[*] Starting Go API server on :8080..."
cd /app
./server/etheriatimes-api &
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
