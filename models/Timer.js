const mongoose = require('mongoose');

// مدل تایمر برای ذخیره جلسات پومودورو
const timerSchema = new mongoose.Schema({
  sessionType: {
    type: String,
    enum: ['work', 'break', 'longBreak'],
    required: true
  },
  duration: {
    type: Number, // مدت زمان به ثانیه
    required: true
  },
  date: {
    type: String, // تاریخ شمسی
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }]
});

module.exports = mongoose.model('Timer', timerSchema);
