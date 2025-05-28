// // app.js
// const express = require('express');
// const app = express();

// // Optional: middleware (e.g. JSON parsing)
// app.use(express.json());

// // Define the /api/tasks route
// app.get('/api/tasks', (req, res) => {
//   res.status(200).json({ message: 'Tasks retrieved successfully' });
// });

// module.exports = app;

const express = require('express');
const app = express();

app.use(express.json());

// Simulated in-memory task DB (for testing)
let tasks = [];
let taskId = 1;

app.post('/api/tasks', (req, res) => {
  const task = { _id: taskId++, ...req.body };
  tasks.push(task);
  res.status(201).json(task);
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t._id == req.params.id);
  if (!task) return res.status(404).send('Not found');
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t._id == req.params.id);
  if (index === -1) return res.status(404).send('Not found');
  tasks.splice(index, 1);
  res.status(200).send('Deleted');
});

module.exports = app;
