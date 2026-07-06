const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getRecommendations,
  getClients,
  assignClientToDietitian,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateProfile);
router.get('/recommendations', protect, getRecommendations);
router.get('/clients', protect, authorize('Dietitian', 'Admin'), getClients);
router.post('/clients/assign', protect, authorize('Dietitian'), assignClientToDietitian);
router.get('/admin/all', protect, authorize('Admin'), getAllUsers);
router.delete('/admin/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
