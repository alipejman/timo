const mongoose = require('mongoose');

// مدل چک‌لیست برای ذخیره کارهای روزانه
const checklistSchema = new mongoose.Schema({
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
  items: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Tasks that were postponed INTO this day from previous days
  postponed: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    fromDate: {
      type: String,
      required: false,
      trim: true
    }
  }],
  // Tasks that were deleted from this day
  deleted: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    deletedAt: {
      type: Date,
      default: Date.now
    }
  }],
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
checklistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// ایندکس برای جستجوی سریع بر اساس تاریخ
checklistSchema.index({ date: 1 });

module.exports = mongoose.model('Checklist', checklistSchema);
