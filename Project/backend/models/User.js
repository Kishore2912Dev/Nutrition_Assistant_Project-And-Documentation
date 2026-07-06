const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['User', 'Dietitian', 'Admin'],
    default: 'User'
  },
  // Profile details for client users
  age: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', null],
    default: null
  },
  height: {
    type: Number, // in cm
    default: null
  },
  weight: {
    type: Number, // in kg
    default: null
  },
  bmi: {
    type: Number,
    default: null
  },
  activityLevel: {
    type: String,
    enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', null],
    default: null
  },
  goal: {
    type: String,
    enum: ['Lose Weight', 'Maintain Weight', 'Gain Muscle', 'Improve Health', null],
    default: null
  },
  dietaryPreference: {
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Keto', 'Non-Veg', 'Any', null],
    default: null
  },
  medicalConditions: {
    type: String, // comma separated or text
    default: ''
  },
  // For Dietitian role: list of user clients assigned to them
  clients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
