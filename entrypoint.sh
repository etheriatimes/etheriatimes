#!/bin/sh
set -e

PG_BIN=""
PG_DATA="/var/lib/postgresql/data"
PG_CONF="/etc/postgresql/16/postgresql.conf"
PG_LOG="/var/lib/postgresql/logfile"

if [ -x /usr/bin/initdb ]; then
    PG_BIN="/usr/bin"
elif [ -x /usr/lib/postgresql/16/bin/initdb ]; then
    PG_BIN="/usr/lib/postgresql/16/bin"
elif [ -x /usr/lib/postgresql16/bin/initdb ]; then
    PG_BIN="/usr/lib/postgresql16/bin"
else
    echo "[!] PostgreSQL initdb not found in known locations"
    exit 1
fi

# ── PostgreSQL ────────────────────────────────────────────────────────────────

echo "[*] Initializing PostgreSQL..."
if [ ! -f "$PG_DATA/PG_VERSION" ]; then
    su -s /bin/sh postgres -c "$PG_BIN/initdb -D $PG_DATA"
fi

su -s /bin/sh postgres -c \
  "$PG_BIN/pg_ctl -D $PG_DATA \
    -o '-c config_file=$PG_CONF' \
    -l $PG_LOG start"

echo "[*] Waiting for PostgreSQL to be ready..."
until su -s /bin/sh postgres -c "$PG_BIN/pg_isready -h 127.0.0.1 -p 5432" >/dev/null 2>&1; do
    sleep 1
done

# ── Provisioning DB ───────────────────────────────────────────────────────────

echo "[*] Provisioning database..."

# Create user (can be in transaction)
su -s /bin/sh postgres -c "$PG_BIN/psql -v ON_ERROR_STOP=0 <<'SQL'
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'aether') THEN
    CREATE USER aether WITH SUPERUSER PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;
SQL"

# Create database
su -s /bin/sh postgres -c "$PG_BIN/psql -v ON_ERROR_STOP=0 -c \
  \"CREATE DATABASE etheria_account OWNER aether\"" 2>/dev/null || true

# ── Migrations Prisma ─────────────────────────────────────────────────────────

# No migration files exist - schema is already applied
echo "[*] Skipping Prisma migrations (no migration files)."

# ── Go API ────────────────────────────────────────────────────────────────────

echo "[*] Starting Go API on :8080..."
cd /app/server
./etheriatimes-api &
API_PID=$!

# ── Next.js ───────────────────────────────────────────────────────────────────

echo "[*] Starting Next.js on :3000..."
cd /app
PORT=3000 node server.js &
NEXT_PID=$!

echo "[+] All services running — PG | API($API_PID) | Next($NEXT_PID)"

# ── Graceful shutdown ─────────────────────────────────────────────────────────

cleanup() {
    echo "[*] Shutting down gracefully..."
    kill "$API_PID" "$NEXT_PID" 2>/dev/null
    su -s /bin/sh postgres -c \
      "$PG_BIN/pg_ctl -D $PG_DATA stop -m fast" 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# ── Surveillance des processus ────────────────────────────────────────────────
# Boucle de veille : si l'un des deux processus meurt, on tue l'autre
# et on laisse Docker restart policy relancer le container proprement

while true; do
    if ! kill -0 "$API_PID" 2>/dev/null; then
        echo "[!] Go API (PID $API_PID) has died — shutting down"
        kill "$NEXT_PID" 2>/dev/null
        exit 1
    fi
    if ! kill -0 "$NEXT_PID" 2>/dev/null; then
        echo "[!] Next.js (PID $NEXT_PID) has died — shutting down"
        kill "$API_PID" 2>/dev/null
        exit 1
    fi
    sleep 5
done