const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();
app.use(express.json());

// Database Connection
// Use the provided URI or a default placeholder
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskdb?retryWrites=true&w=majority';

// For local testing without a real MongoDB connection, we catch errors but allow the server to start
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to Serverless MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB, using mock responses for demo purposes if DB is down.');
    console.error('Error:', err.message);
  });

// --- Routes ---

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Kubernetes CRUD API</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .container { background: #1e293b; padding: 3rem; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); text-align: center; border: 1px solid #334155; max-width: 600px;}
          h1 { color: #38bdf8; margin-top: 0; font-size: 2.5rem; }
          p { color: #cbd5e1; font-size: 1.1rem; line-height: 1.6; }
          .badge { background: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: bold; display: inline-block; margin-bottom: 1rem;}
          .endpoints { text-align: left; background: #0f172a; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem; border: 1px solid #334155;}
          code { color: #a78bfa; font-family: monospace; font-size: 1.1rem;}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge">Kubernetes Pod Running 🟢</div>
          <h1>Task Management API</h1>
          <p>Welcome to the Serverless CRUD Application! The backend is successfully running inside a Docker container, orchestrated by Kubernetes.</p>
          <div class="endpoints">
            <p><strong>Available Endpoints:</strong></p>
            <p>GET <code>/tasks</code> - Retrieve all tasks</p>
            <p>POST <code>/tasks</code> - Create a new task</p>
            <p>GET <code>/health</code> - Cluster health check</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// --- CRUD Operations ---

// CREATE
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ (All)
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ (Single)
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint for Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', dbState: mongoose.connection.readyState });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
