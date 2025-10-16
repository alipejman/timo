const mongoose = require('mongoose');

// مدل mood برای ذخیره حالات روحی روزانه
const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true,
    trim: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'],
    default: 'neutral'
  },
  note: {
    type: String,
    trim: true,
    maxlength: 500
  },
  activities: [{
    type: String,
    trim: true
  }],
  energy: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  sleep: {
    hours: {
      type: Number,
      min: 0,
      max: 24
    },
    quality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// به‌روزرسانی خودکار updatedAt
moodSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// ایندکس برای جستجوی سریع بر اساس تاریخ
moodSchema.index({ date: 1 });

module.exports = mongoose.model('Mood', moodSchema);
