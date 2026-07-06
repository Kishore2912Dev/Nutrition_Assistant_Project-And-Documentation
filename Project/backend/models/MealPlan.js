const mongoose = require('mongoose');

const PlanMealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    required: true
  },
  food: {
    type: String,
    required: true
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
  }
});

const MealPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meals: [PlanMealSchema],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 7 days from now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
