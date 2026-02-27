const { spawn } = require('child_process');

console.log('Starting Mental Health Support Application...');

// Start backend server
const backend = spawn('node_modules/.bin/tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3000' }
});

// Start frontend server after a short delay
setTimeout(() => {
  const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
    stdio: 'inherit'
  });
  
  frontend.on('error', (err) => {
    console.error('Frontend error:', err);
  });
}, 2000);

backend.on('error', (err) => {
  console.error('Backend error:', err);
});

console.log('Backend starting on port 3000...');
console.log('Frontend will start on port 5173...');