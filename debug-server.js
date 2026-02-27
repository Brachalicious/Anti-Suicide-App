const http = require('http');
const fs = require('fs');

const PORT = 3000;

console.log('Starting debug server...');

// Check if preview.html exists
if (!fs.existsSync('preview.html')) {
  console.error('ERROR: preview.html not found');
  process.exit(1);
}

console.log('preview.html found');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Set CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile('preview.html', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading preview.html:', err);
        res.writeHead(500);
        res.end('Error loading app');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/api/crisis-hotlines') {
    const hotlines = [
      {
        id: "1",
        name: "988 Suicide & Crisis Lifeline",
        phoneNumber: "988",
        website: "https://988lifeline.org",
        description: "Free and confidential emotional support 24/7",
        country: "US",
        available247: true
      },
      {
        id: "2", 
        name: "Crisis Text Line",
        phoneNumber: "Text HOME to 741741",
        website: "https://crisistextline.org",
        description: "Free, 24/7 crisis support via text",
        country: "US",
        available247: true
      }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(hotlines, null, 2));
  } else if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found: ' + req.url);
  }
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('listening', () => {
  console.log(`Mental Health Support App running on http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API test: http://localhost:${PORT}/api/crisis-hotlines`);
});

server.listen(PORT, '0.0.0.0');

// Keep process alive
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully'); 
  server.close(() => {
    process.exit(0);
  });
});

console.log('Server setup complete');