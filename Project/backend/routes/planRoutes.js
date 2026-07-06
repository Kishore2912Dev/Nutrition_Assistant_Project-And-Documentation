const express = require('express');
const router = express.Router();
const {
  createMealPlan,
  getUserMealPlans,
  getDietitianMealPlans,
  getAllMealPlans,
  editMealPlan,
  deleteMealPlan
} = require('../controllers/mealPlanController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Dietitian', 'Admin'), createMealPlan);
router.get('/client', protect, getUserMealPlans);
router.get('/dietitian', protect, authorize('Dietitian'), getDietitianMealPlans);
router.get('/admin', protect, authorize('Admin'), getAllMealPlans);
router.put('/:id', protect, authorize('Dietitian', 'Admin'), editMealPlan);
router.delete('/:id', protect, authorize('Dietitian', 'Admin'), deleteMealPlan);

module.exports = router;
