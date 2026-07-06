const express = require('express');
const router = express.Router();
const {
  searchFood,
  logMeal,
  getUserMeals,
  deleteMealLog,
  getNutritionSummary
} = require('../controllers/mealController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchFood);
router.post('/log', protect, logMeal);
router.get('/history', protect, getUserMeals);
router.delete('/:id', protect, deleteMealLog);
router.get('/summary', protect, getNutritionSummary);

module.exports = router;
