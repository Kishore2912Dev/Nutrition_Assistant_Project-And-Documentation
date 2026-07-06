const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number, // in kg
    required: true
  },
  bmi: {
    type: Number,
    required: true
  },
  dailyCalories: {
    type: Number, // sum of calories consumed on this day
    default: 0
  },
  waterIntake: {
    type: Number, // in ml
    default: 0
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one progress entry per user per day
ProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
