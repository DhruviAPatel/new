// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// API Routes
// Create a new task
app.post('/api/tasks', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
