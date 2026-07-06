const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  calories: {
    type: Number, // per 100g
    required: true
  },
  protein: {
    type: Number, // per 100g (in grams)
    required: true
  },
  carbs: {
    type: Number, // per 100g (in grams)
    required: true
  },
  fat: {
    type: Number, // per 100g (in grams)
    required: true
  },
  fiber: {
    type: Number, // per 100g (in grams)
    default: 0
  },
  servingSize: {
    type: Number, // default serving base
    default: 100
  },
  servingUnit: {
    type: String, // default unit (e.g. g, ml)
    default: 'g'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Food', FoodSchema);
