const MealPlan = require('../models/MealPlan');
const User = require('../models/User');

// @desc    Create and assign a meal plan to a user
// @route   POST /api/plans
// @access  Private (Dietitian/Admin)
const createMealPlan = async (req, res) => {
  try {
    const { title, description, assignedTo, meals, startDate, endDate } = req.body;

    if (!title || !assignedTo || !meals || meals.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide a title, client reference, and meal list' });
    }

    // Verify client exists
    const client = await User.findById(assignedTo);
    if (!client || client.role !== 'User') {
      return res.status(404).json({ success: false, message: 'Client not found or user is not a standard client' });
    }

    const newPlan = await MealPlan.create({
      title,
      description,
      createdBy: req.user.id,
      assignedTo,
      meals,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({ success: true, plan: newPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get meal plans assigned to the current client user
// @route   GET /api/plans/client
// @access  Private
const getUserMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ assignedTo: req.user.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get meal plans created by a dietitian
// @route   GET /api/plans/dietitian
// @access  Private (Dietitian)
const getDietitianMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ createdBy: req.user.id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all meal plans (Admin only)
// @route   GET /api/plans/admin
// @access  Private (Admin)
const getAllMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({})
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a meal plan
// @route   PUT /api/plans/:id
// @access  Private (Dietitian/Admin)
const editMealPlan = async (req, res) => {
  try {
    const { title, description, meals, startDate, endDate } = req.body;

    const plan = await MealPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Meal plan not found' });
    }

    // Security: Only creator or Admin can edit
    if (plan.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this plan' });
    }

    if (title) plan.title = title;
    if (description) plan.description = description;
    if (meals) plan.meals = meals;
    if (startDate) plan.startDate = new Date(startDate);
    if (endDate) plan.endDate = new Date(endDate);

    await plan.save();

    res.json({ success: true, message: 'Meal plan updated successfully', plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a meal plan
// @route   DELETE /api/plans/:id
// @access  Private (Dietitian/Admin)
const deleteMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Meal plan not found' });
    }

    // Security: Only creator or Admin can delete
    if (plan.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this plan' });
    }

    await MealPlan.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Meal plan removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMealPlan,
  getUserMealPlans,
  getDietitianMealPlans,
  getAllMealPlans,
  editMealPlan,
  deleteMealPlan
};
