const { spawn } = require('child_process');

console.log('Starting Mental Health Support Application...');

const backendPort = process.env.BACKEND_PORT || process.env.PORT || '3000';
const frontendPort = process.env.FRONTEND_PORT || '5173';

// Ensure the Vite proxy forwards /api to the backend port we're actually running on.
if (!process.env.VITE_API_PROXY_TARGET && !process.env.VITE_API_PROXY_PORT) {
  process.env.VITE_API_PROXY_PORT = backendPort;
}

// Start backend server
const backend = spawn('node_modules/.bin/tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: backendPort }
});

// Start frontend server after a short delay
setTimeout(() => {
  const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', frontendPort], {
    stdio: 'inherit'
  });

  frontend.on('error', (err) => {
    console.error('Frontend error:', err);
  });
}, 2000);

backend.on('error', (err) => {
  console.error('Backend error:', err);
});

console.log(`Backend starting on port ${backendPort}...`);
console.log(`Frontend will start on port ${frontendPort}...`);
