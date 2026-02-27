#!/bin/bash
echo "Starting Mental Health Support App..."

# Start backend server
npx tsx server/index.ts &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend dev server
npx vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo "Backend started on port 3000 (PID: $BACKEND_PID)"
echo "Frontend started on port 5173 (PID: $FRONTEND_PID)"
echo "App is ready! Access it at http://localhost:5173"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID