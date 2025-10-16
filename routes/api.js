const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Timer = require('../models/Timer');
const Checklist = require('../models/Checklist');
const Mood = require('../models/Mood');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// Routes برای Tasks
// دریافت همه تسک‌ها
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ایجاد تسک جدید
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// به‌روزرسانی تسک
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, 
      req.body, 
      { new: true }
    );
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
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
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
    const timer = new Timer({
      ...req.body,
      user: req.user._id
    });
    await timer.save();
    res.status(201).json(timer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// دریافت تاریخچه تایمرها
router.get('/timers', async (req, res) => {
  try {
    const timers = await Timer.find({ user: req.user._id }).sort({ completedAt: -1 });
    res.json(timers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes برای Checklist
// دریافت چک‌لیست بر اساس تاریخ
router.get('/checklist', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'تاریخ الزامی است' });
    }
    
    let checklist = await Checklist.findOne({ user: req.user._id, date });
    
    // اگر چک‌لیست وجود نداشت، یک چک‌لیست خالی ایجاد کن
    if (!checklist) {
      checklist = new Checklist({ 
        user: req.user._id,
        date, 
        items: [] 
      });
      await checklist.save();
    }
    
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ذخیره چک‌لیست
router.post('/checklist/save', async (req, res) => {
  try {
    const { date, items } = req.body;
    
    if (!date) {
      return res.status(400).json({ error: 'تاریخ الزامی است' });
    }
    
    // پیدا کردن یا ایجاد چک‌لیست
    let checklist = await Checklist.findOne({ user: req.user._id, date });
    
    if (!checklist) {
      checklist = new Checklist({ user: req.user._id, date, items: [] });
    }
    
    // تبدیل آیتم‌ها از فرمت JavaScript به فرمت دیتابیس
    const dbItems = (items || []).map(item => ({
      text: item.text || '',
      completed: item.completed !== undefined ? item.completed : (item.done || false)
    }));
    
    // به‌روزرسانی آیتم‌ها
    checklist.items = dbItems;
    await checklist.save();
    
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// به‌روزرسانی آیتم چک‌لیست
router.put('/checklist/item/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { completed, text } = req.body;
    
    // پیدا کردن چک‌لیست که شامل این آیتم است
    const checklist = await Checklist.findOne({ 'items._id': itemId });
    
    if (!checklist) {
      return res.status(404).json({ error: 'آیتم پیدا نشد' });
    }
    
    // پیدا کردن و به‌روزرسانی آیتم
    const item = checklist.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'آیتم پیدا نشد' });
    }
    
    if (completed !== undefined) item.completed = completed;
    if (text !== undefined) item.text = text;
    
    await checklist.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// حذف چک‌لیست
router.delete('/checklist/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const checklist = await Checklist.findOneAndDelete({ date });
    
    if (!checklist) {
      return res.status(404).json({ error: 'چک‌لیست پیدا نشد' });
    }
    
    res.json({ message: 'چک‌لیست حذف شد' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes برای Mood
// دریافت mood بر اساس تاریخ
router.get('/mood', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'تاریخ الزامی است' });
    }
    
    let mood = await Mood.findOne({ user: req.user._id, date });
    
    // اگر mood وجود نداشت، یک mood خالی ایجاد کن
    if (!mood) {
      mood = new Mood({ 
        user: req.user._id,
        date, 
        mood: 'neutral',
        energy: 5,
        activities: [],
        sleep: { hours: 8, quality: 'good' }
      });
      try {
        await mood.save();
      } catch (error) {
        console.error('Error creating new mood:', error);
        // اگر خطا در ایجاد mood جدید، یک mood خالی برگردان
        return res.json({
          date,
          mood: 3, // neutral
          energy: 5,
          activities: [],
          sleep: { hours: 8, quality: 'good' }
        });
      }
    }
    
    // تبدیل رشته mood به عدد برای سازگاری با JavaScript
    const moodToNumber = {
      'very-sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very-happy': 5
    };
    
    const response = mood.toObject();
    response.mood = moodToNumber[mood.mood] || 3;
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// دریافت mood در بازه زمانی
router.get('/mood/range', async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'تاریخ شروع و پایان الزامی است' });
    }
    
    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: from, $lte: to }
    }).sort({ date: 1 });
    
    // تبدیل رشته mood به عدد برای سازگاری با JavaScript
    const moodToNumber = {
      'very-sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very-happy': 5
    };
    
    const response = moods.map(mood => {
      const moodObj = mood.toObject();
      moodObj.mood = moodToNumber[mood.mood] || 3;
      return moodObj;
    });
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ذخیره mood
router.post('/mood/save', async (req, res) => {
  try {
    const { date, mood, note, activities, energy, sleep } = req.body;
    
    console.log('mood/save request:', { date, mood, note, activities, energy, sleep });
    
    if (!date) {
      return res.status(400).json({ error: 'تاریخ الزامی است' });
    }
    
    // تبدیل عدد mood به رشته
    let moodString = mood;
    if (typeof mood === 'number') {
      const moodMap = {
        1: 'very-sad',
        2: 'sad', 
        3: 'neutral',
        4: 'happy',
        5: 'very-happy'
      };
      moodString = moodMap[mood] || 'neutral';
    }
    
    console.log('moodString:', moodString);
    
    // پیدا کردن یا ایجاد mood
    let moodRecord = await Mood.findOne({ user: req.user._id, date });
    
    if (!moodRecord) {
      moodRecord = new Mood({ user: req.user._id, date });
    }
    
    // به‌روزرسانی فیلدها - همیشه mood را تنظیم کن
    moodRecord.mood = moodString || 'neutral';
    if (note !== undefined) moodRecord.note = note;
    if (activities) moodRecord.activities = activities;
    if (energy) moodRecord.energy = energy;
    if (sleep) moodRecord.sleep = sleep;
    
    // تنظیم مقادیر پیش‌فرض اگر وجود نداشته باشند
    if (!moodRecord.energy) moodRecord.energy = 5;
    if (!moodRecord.sleep) moodRecord.sleep = { hours: 8, quality: 'good' };
    
    console.log('moodRecord before save:', moodRecord);
    
    await moodRecord.save();
    res.json(moodRecord);
  } catch (error) {
    console.error('خطا در ذخیره mood:', error);
    res.status(500).json({ error: error.message });
  }
});

// حذف mood
router.delete('/mood/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const mood = await Mood.findOneAndDelete({ date });
    
    if (!mood) {
      return res.status(404).json({ error: 'mood پیدا نشد' });
    }
    
    res.json({ message: 'mood حذف شد' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes برای Timer (تکمیلی)
// دریافت تایمرهای یک روز خاص
router.get('/timer', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'تاریخ الزامی است' });
    }
    
    // جستجو بر اساس تاریخ شمسی (string)
    const timers = await Timer.find({
      user: req.user._id,
      date: date
    }).sort({ completedAt: 1 });
    
    // محاسبه آمار
    const stats = {
      totalWork: 0,
      totalBreak: 0,
      totalLongBreak: 0,
      totalSeconds: 0, // اضافه کردن totalSeconds
      sessions: timers.length,
      timers: timers
    };
    
    timers.forEach(timer => {
      const duration = timer.duration / 60; // تبدیل به دقیقه
      if (timer.sessionType === 'work') {
        stats.totalWork += duration;
        stats.totalSeconds += timer.duration; // اضافه کردن به totalSeconds
      } else if (timer.sessionType === 'break') {
        stats.totalBreak += duration;
      } else if (timer.sessionType === 'longBreak') {
        stats.totalLongBreak += duration;
      }
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// دریافت تایمرها در بازه زمانی
router.get('/timer/range', async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'تاریخ شروع و پایان الزامی است' });
    }
    
    console.log('Timer range request:', { from, to, user: req.user._id });
    
    // جستجو بر اساس تاریخ شمسی (string) و کاربر
    const timers = await Timer.find({
      user: req.user._id, // اضافه کردن فیلتر کاربر
      date: {
        $gte: from,
        $lte: to
      }
    }).sort({ completedAt: 1 });
    
    console.log('Found timers:', timers.length);
    
    // محاسبه آمار
    const stats = {
      totalWork: 0,
      totalBreak: 0,
      totalLongBreak: 0,
      totalSeconds: 0,
      sessions: timers.length,
      timers: timers
    };
    
    timers.forEach(timer => {
      const duration = timer.duration / 60; // تبدیل به دقیقه
      if (timer.sessionType === 'work') {
        stats.totalWork += duration;
        stats.totalSeconds += timer.duration;
      } else if (timer.sessionType === 'break') {
        stats.totalBreak += duration;
        stats.totalSeconds += timer.duration;
      } else if (timer.sessionType === 'longBreak') {
        stats.totalLongBreak += duration;
        stats.totalSeconds += timer.duration;
      }
    });
    
    console.log('Timer range stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Timer range error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ذخیره تایمر جدید
router.post('/timer/save', async (req, res) => {
  try {
    const { sessionType, duration, notes, tags } = req.body;
    
    if (!sessionType || !duration) {
      return res.status(400).json({ error: 'نوع جلسه و مدت زمان الزامی است' });
    }
    
    const timer = new Timer({
      user: req.user._id,
      sessionType,
      duration,
      notes,
      tags,
      completedAt: new Date()
    });
    
    await timer.save();
    res.json(timer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// اضافه کردن ثانیه به تایمر (برای تایمر زنده)
router.post('/timer/addSeconds', async (req, res) => {
  try {
    console.log('=== ADD SECONDS API START ===');
    console.log('Raw request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const { sessionType, seconds, notes, tags, date } = req.body;
    
    console.log('Extracted values:', { sessionType, seconds, notes, tags, date });
    console.log('Type of sessionType:', typeof sessionType);
    console.log('Type of seconds:', typeof seconds);
    console.log('Value of sessionType:', sessionType);
    console.log('Value of seconds:', seconds);
    
    // بررسی پارامترهای الزامی
    if (!sessionType || !seconds) {
      console.log('❌ Missing required parameters');
      console.log('sessionType:', sessionType, 'seconds:', seconds);
      return res.status(400).json({ error: 'نوع جلسه و ثانیه الزامی است' });
    }
    
    // بررسی نوع جلسه
    if (!['work', 'break', 'longBreak'].includes(sessionType)) {
      return res.status(400).json({ error: 'نوع جلسه باید work، break یا longBreak باشد' });
    }
    
    // بررسی مقدار ثانیه
    const duration = Number(seconds);
    if (!Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({ error: 'مقدار ثانیه باید عدد مثبت باشد' });
    }
    
    // تبدیل تاریخ شمسی به میلادی برای ذخیره در دیتابیس
    const jalaliDate = date || moment().format('jYYYY/jMM/jDD');
    console.log('Using date:', jalaliDate);
    
    const timer = new Timer({
      user: req.user._id,
      sessionType,
      duration,
      date: jalaliDate, // تاریخ شمسی
      notes,
      tags,
      completedAt: new Date()
    });
    
    await timer.save();
    res.json(timer);
  } catch (error) {
    console.error('addSeconds error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
