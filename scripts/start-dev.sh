#!/bin/bash

# Load environment variables
set -a
source .env.local
set +a

# Find cloud-sql-proxy executable
PROXY_PATH=$(which cloud-sql-proxy)

if [ -z "$PROXY_PATH" ]; then
    echo "Error: cloud-sql-proxy not found. Installing..."
    brew install cloud-sql-proxy
    PROXY_PATH=$(which cloud-sql-proxy)
fi

if [ -z "$PROXY_PATH" ]; then
    echo "Error: Failed to install cloud-sql-proxy"
    exit 1
fi

echo "Using cloud-sql-proxy at: $PROXY_PATH"

# Start Cloud SQL Proxy
echo "Starting Cloud SQL Proxy..."
"$PROXY_PATH" --port 5432 \
  "$INSTANCE_CONNECTION_NAME" &

# Store proxy PID
echo $! > .proxy.pid

echo "Waiting for proxy to start..."
sleep 5

echo "Starting Next.js development server..."
npm run dev

# Cleanup on exit
trap 'if [ -f .proxy.pid ]; then kill $(cat .proxy.pid); rm .proxy.pid; fi' EXIT
