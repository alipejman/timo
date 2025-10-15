const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Timer = require('../models/Timer');

// Routes برای Tasks
// دریافت همه تسک‌ها
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ایجاد تسک جدید
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// به‌روزرسانی تسک
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'تسک پیدا نشد' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// حذف تسک
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'تسک پیدا نشد' });
    }
    res.json({ message: 'تسک حذف شد' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes برای Timer
// ذخیره جلسه تایمر
router.post('/timers', async (req, res) => {
  try {
    const timer = new Timer(req.body);
    await timer.save();
    res.status(201).json(timer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// دریافت تاریخچه تایمرها
router.get('/timers', async (req, res) => {
  try {
    const timers = await Timer.find().sort({ completedAt: -1 });
    res.json(timers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
