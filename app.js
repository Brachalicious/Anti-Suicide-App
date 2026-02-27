const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    app: 'Mental Health Support', 
    timestamp: new Date().toISOString() 
  });
});

// Crisis hotlines API
app.get('/api/crisis-hotlines', (req, res) => {
  const hotlines = [
    {
      id: "1",
      name: "988 Suicide & Crisis Lifeline",
      phoneNumber: "988",
      website: "https://988lifeline.org",
      description: "Free and confidential emotional support to people in suicidal crisis or emotional distress 24 hours a day, 7 days a week.",
      country: "US",
      available247: true,
      languages: ["English", "Spanish"]
    },
    {
      id: "2",
      name: "Crisis Text Line", 
      phoneNumber: "Text HOME to 741741",
      website: "https://crisistextline.org",
      description: "Free, 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the US.",
      country: "US", 
      available247: true,
      languages: ["English", "Spanish"]
    },
    {
      id: "3",
      name: "International Association for Suicide Prevention",
      phoneNumber: "Various",
      website: "https://www.iasp.info/resources/Crisis_Centres", 
      description: "Directory of crisis centers worldwide.",
      country: "International",
      available247: false,
      languages: ["Multiple"]
    }
  ];
  res.json(hotlines);
});

// Serve the mental health app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mental Health Support App running on port ${PORT}`);
  console.log(`Access your app at: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Crisis API: http://localhost:${PORT}/api/crisis-hotlines`);
});