const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  food: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number, // in grams or servings
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  fiber: {
    type: Number,
    default: 0
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meal', MealSchema);
