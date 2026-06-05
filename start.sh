#!/bin/bash
set -e

echo "Starting Mental Health Support App..."

BACKEND_PORT="${BACKEND_PORT:-${PORT:-3000}}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

# Ensure the frontend proxy points at the backend port you actually started
export VITE_API_PROXY_PORT="${VITE_API_PROXY_PORT:-$BACKEND_PORT}"

# Start backend server
PORT="$BACKEND_PORT" npx tsx server/index.ts &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend dev server
npx vite --host 0.0.0.0 --port "$FRONTEND_PORT" &
FRONTEND_PID=$!

echo "Backend started on port $BACKEND_PORT (PID: $BACKEND_PID)"
echo "Frontend started on port $FRONTEND_PORT (PID: $FRONTEND_PID)"
echo "App is ready! Access it at http://localhost:$FRONTEND_PORT"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
