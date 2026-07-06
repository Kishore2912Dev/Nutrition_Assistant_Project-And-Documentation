const express = require('express');
const router = express.Router();
const {
  logWeight,
  logWater,
  getProgressHistory,
  getClientProgress
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/weight', protect, logWeight);
router.post('/water', protect, logWater);
router.get('/history', protect, getProgressHistory);
router.get('/client/:clientId', protect, authorize('Dietitian', 'Admin'), getClientProgress);

module.exports = router;
