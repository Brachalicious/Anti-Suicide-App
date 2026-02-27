const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve the mental health app preview
    fs.readFile('preview.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('App not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/api/crisis-hotlines') {
    // Crisis hotlines API
    const hotlines = [
      {
        id: "1",
        name: "988 Suicide & Crisis Lifeline",
        phoneNumber: "988", 
        description: "Free and confidential emotional support 24/7"
      },
      {
        id: "2",
        name: "Crisis Text Line",
        phoneNumber: "Text HOME to 741741",
        description: "Free, 24/7 crisis support via text"
      }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(hotlines));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mental Health Support App running on port ${PORT}`);
  console.log(`Access your app at: http://localhost:${PORT}`);
});

// Keep the server running
process.on('SIGINT', () => {
  console.log('Server stopped');
  process.exit(0);
});