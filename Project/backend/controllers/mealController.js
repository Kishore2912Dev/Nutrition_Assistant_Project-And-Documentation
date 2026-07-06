const Meal = require('../models/Meal');
const Food = require('../models/Food');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Helper to get start and end of a specific date in local timezone
const getDayBounds = (dateStr) => {
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(targetDate);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// Helper to update or create Progress entry for a day (daily calories tracking)
const updateDailyProgressCalorieSum = async (userId, dateStr) => {
  try {
    const { start, end } = getDayBounds(dateStr);

    // Sum calories logged today
    const meals = await Meal.find({
      userId,
      date: { $gte: start, $lte: end }
    });

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

    // Update weight/bmi from user profile
    const user = await User.findById(userId);
    const weight = user.weight || 70; // fallback if not configured
    const bmi = user.bmi || 22;

    // Find progress for today, if not exists, create it
    await Progress.findOneAndUpdate(
      {
        userId,
        date: { $gte: start, $lte: end }
      },
      {
        userId,
        weight,
        bmi,
        dailyCalories: Math.round(totalCalories),
        date: start // Normalize date to start of day
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Failed to sync progress calories:', error);
  }
};

// @desc    Search food items in the database
// @route   GET /api/meals/search
// @access  Private
const searchFood = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, foods: [] });
    }

    const foods = await Food.find({
      name: { $regex: q, $options: 'i' }
    }).limit(10);

    res.json({ success: true, foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log a meal consumed
// @route   POST /api/meals/log
// @access  Private
const logMeal = async (req, res) => {
  try {
    const { foodName, quantity, mealType, date, calories, protein, carbs, fat, fiber } = req.body;

    if (!foodName || !quantity || !mealType) {
      return res.status(400).json({ success: false, message: 'Please provide food name, quantity, and meal type' });
    }

    // Try finding the food in our DB to scale macros
    const dbFood = await Food.findOne({ name: foodName });
    let mealMacros = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };

    if (dbFood) {
      // Scale based on quantity per 100g
      const scale = quantity / 100;
      mealMacros.calories = Math.round(dbFood.calories * scale);
      mealMacros.protein = parseFloat((dbFood.protein * scale).toFixed(1));
      mealMacros.carbs = parseFloat((dbFood.carbs * scale).toFixed(1));
      mealMacros.fat = parseFloat((dbFood.fat * scale).toFixed(1));
      mealMacros.fiber = parseFloat((dbFood.fiber * scale).toFixed(1));
    } else {
      // Custom food input: use parameters provided in request body
      mealMacros.calories = calories ? Math.round(calories) : 0;
      mealMacros.protein = protein ? parseFloat(protein) : 0;
      mealMacros.carbs = carbs ? parseFloat(carbs) : 0;
      mealMacros.fat = fat ? parseFloat(fat) : 0;
      mealMacros.fiber = fiber ? parseFloat(fiber) : 0;
    }

    const mealDate = date ? new Date(date) : new Date();

    const newMeal = await Meal.create({
      userId: req.user.id,
      food: foodName,
      quantity,
      mealType,
      date: mealDate,
      ...mealMacros
    });

    // Update daily progress calories sum
    await updateDailyProgressCalorieSum(req.user.id, mealDate);

    res.status(201).json({ success: true, meal: newMeal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's logged meals (can filter by date)
// @route   GET /api/meals/history
// @access  Private
const getUserMeals = async (req, res) => {
  try {
    const { date } = req.query; // Expect YYYY-MM-DD
    let query = { userId: req.user.id };

    if (date) {
      const { start, end } = getDayBounds(date);
      query.date = { $gte: start, $lte: end };
    }

    const meals = await Meal.find(query).sort({ date: -1 });
    res.json({ success: true, meals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a logged meal
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMealLog = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal log not found' });
    }

    // Security: Only owner can delete
    if (meal.userId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await Meal.findByIdAndDelete(req.params.id);

    // Sync progress
    await updateDailyProgressCalorieSum(meal.userId, meal.date);

    res.json({ success: true, message: 'Meal log removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nutrition totals for a specific date
// @route   GET /api/meals/summary
// @access  Private
const getNutritionSummary = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    const { start, end } = getDayBounds(date);

    const meals = await Meal.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    const summary = meals.reduce(
      (totals, meal) => {
        totals.calories += meal.calories;
        totals.protein += meal.protein;
        totals.carbs += meal.carbs;
        totals.fat += meal.fat;
        totals.fiber += meal.fiber;
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    // Round summary values
    summary.calories = Math.round(summary.calories);
    summary.protein = parseFloat(summary.protein.toFixed(1));
    summary.carbs = parseFloat(summary.carbs.toFixed(1));
    summary.fat = parseFloat(summary.fat.toFixed(1));
    summary.fiber = parseFloat(summary.fiber.toFixed(1));

    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchFood,
  logMeal,
  getUserMeals,
  deleteMealLog,
  getNutritionSummary
};
