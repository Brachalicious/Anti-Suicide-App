const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// API mock data for demo
const crisisHotlines = [
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
  }
];

// API routes
app.get('/api/crisis-hotlines', (req, res) => {
  res.json(crisisHotlines);
});

app.get('/api/resources', (req, res) => {
  res.json([
    {
      id: "1",
      title: "Understanding Suicidal Thoughts",
      content: "Suicidal thoughts are more common than you might think. They can be a sign that you're experiencing more pain than you can cope with right now.",
      category: "education",
      tags: ["crisis", "understanding", "support"],
      readTime: 3,
      isEmergency: false
    }
  ]);
});

// Serve the preview
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'preview.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mental Health Support App running on http://0.0.0.0:${PORT}`);
  console.log(`Preview your app at: http://localhost:${PORT}`);
});