const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// Middleware 'auth' protects all routes below (user must be logged in)
router.use(auth);

// GET /api/tasks?search=&status= - list/filter tasks
router.get('/', async (req, res) => {
  const { search = '', status } = req.query;
  const query = { userId: req.user.id };

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  if (status) {
    query.status = status;
  }

  try {
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks - create a new task
router.post('/', async (req, res) => {
  const { title, description, status } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const task = new Task({
      userId: req.user.id,
      title,
      description,
      status,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tasks/:id - get single task by id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tasks/:id - update a task
router.put('/:id', async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
