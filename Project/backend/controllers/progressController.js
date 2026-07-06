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

// @desc    Log weight & recalculate BMI
// @route   POST /api/progress/weight
// @access  Private
const logWeight = async (req, res) => {
  try {
    const { weight, date } = req.body;
    if (!weight) {
      return res.status(400).json({ success: false, message: 'Weight value is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Save weight & recalculate BMI on User profile
    user.weight = Number(weight);
    if (user.height) {
      const heightM = user.height / 100;
      user.bmi = parseFloat((user.weight / (heightM * heightM)).toFixed(2));
    }
    await user.save();

    // Prepare date
    const targetDate = date ? new Date(date) : new Date();
    const { start, end } = getDayBounds(targetDate);

    // Update daily progress log
    const progress = await Progress.findOneAndUpdate(
      {
        userId: req.user.id,
        date: { $gte: start, $lte: end }
      },
      {
        userId: req.user.id,
        weight: user.weight,
        bmi: user.bmi || 22, // fallback
        date: start
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Weight and BMI logged successfully',
      progress,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log water intake (accumulate)
// @route   POST /api/progress/water
// @access  Private
const logWater = async (req, res) => {
  try {
    const { amount, date } = req.body; // amount in ml (e.g. 250)
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Water amount is required' });
    }

    const targetDate = date ? new Date(date) : new Date();
    const { start, end } = getDayBounds(targetDate);

    // Find user stats to fill weight & BMI if creating a new progress document
    const user = await User.findById(req.user.id);
    const weight = user.weight || 70;
    const bmi = user.bmi || 22;

    // Check if a progress log exists for today
    let progress = await Progress.findOne({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    if (progress) {
      progress.waterIntake += Number(amount);
      await progress.save();
    } else {
      progress = await Progress.create({
        userId: req.user.id,
        weight,
        bmi,
        waterIntake: Number(amount),
        date: start
      });
    }

    res.json({
      success: true,
      message: 'Water intake updated successfully',
      progress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get progress tracking history
// @route   GET /api/progress/history
// @access  Private
const getProgressHistory = async (req, res) => {
  try {
    const history = await Progress.find({ userId: req.user.id }).sort({ date: 1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get progress tracking history of a client (Dietitian/Admin only)
// @route   GET /api/progress/client/:clientId
// @access  Private (Dietitian/Admin)
const getClientProgress = async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Optional verification: if dietitian, check if client is assigned to them
    if (req.user.role === 'Dietitian') {
      const dietitian = await User.findById(req.user.id);
      if (!dietitian.clients.includes(clientId)) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this client progress' });
      }
    }

    const history = await Progress.find({ userId: clientId }).sort({ date: 1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  logWeight,
  logWater,
  getProgressHistory,
  getClientProgress
};
