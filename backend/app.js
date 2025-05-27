// app.js
const express = require('express');
const app = express();

// Optional: middleware (e.g. JSON parsing)
app.use(express.json());

// Define the /api/tasks route
app.get('/api/tasks', (req, res) => {
  res.status(200).json({ message: 'Tasks retrieved successfully' });
});

module.exports = app;
