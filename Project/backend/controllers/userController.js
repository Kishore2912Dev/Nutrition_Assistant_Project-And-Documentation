const User = require('../models/User');

// Helper to calculate BMI
const calculateBmi = (weight, height) => {
  if (!weight || !height) return null;
  const heightM = height / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(2));
};

// Helper to generate personalized recommendations
const generateRecommendations = (user) => {
  const { age, gender, height, weight, activityLevel, goal, dietaryPreference, medicalConditions } = user;

  // Verify necessary details exist
  if (!age || !height || !weight) {
    return {
      message: 'Please complete your profile details (age, weight, height) to generate recommendations.',
      dailyCalories: 2000,
      macros: { protein: 120, carbs: 230, fat: 65, fiber: 25 },
      suggestedMeals: [],
      foodsToEat: ['Green leafy vegetables', 'Lean proteins', 'Whole grains', 'Fruits'],
      foodsToAvoid: ['Processed foods', 'Refined sugars', 'Excessive salt', 'Trans fats'],
      waterIntake: 2500
    };
  }

  // 1. Calculate Basal Metabolic Rate (BMR) - Harris-Benedict Equation
  let bmr = 0;
  if (gender === 'Male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else if (gender === 'Female') {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  }

  // 2. Calculate Total Daily Energy Expenditure (TDEE)
  let activityMultiplier = 1.2;
  switch (activityLevel) {
    case 'Sedentary': activityMultiplier = 1.2; break;
    case 'Lightly Active': activityMultiplier = 1.375; break;
    case 'Moderately Active': activityMultiplier = 1.55; break;
    case 'Very Active': activityMultiplier = 1.725; break;
    default: activityMultiplier = 1.2;
  }
  const tdee = bmr * activityMultiplier;

  // 3. Adjust Calories based on Goal
  let dailyCalories = Math.round(tdee);
  if (goal === 'Lose Weight') {
    dailyCalories = Math.round(tdee - 500);
  } else if (goal === 'Gain Muscle') {
    dailyCalories = Math.round(tdee + 300);
  } else if (goal === 'Improve Health') {
    dailyCalories = Math.round(tdee - 150);
  }

  // Ensure reasonable minimum calorie bounds
  if (dailyCalories < 1200) dailyCalories = 1200;

  // 4. Calculate Macronutrients based on Dietary Preference & Goal
  let proteinPercent = 0.25;
  let fatPercent = 0.25;
  let carbsPercent = 0.50;

  // Adjust for keto diet
  if (dietaryPreference === 'Keto') {
    fatPercent = 0.70;
    proteinPercent = 0.25;
    carbsPercent = 0.05;
  } else if (goal === 'Gain Muscle') {
    proteinPercent = 0.30;
    fatPercent = 0.25;
    carbsPercent = 0.45;
  } else if (goal === 'Lose Weight') {
    proteinPercent = 0.30;
    fatPercent = 0.30;
    carbsPercent = 0.40;
  }

  const proteinGrams = Math.round((dailyCalories * proteinPercent) / 4);
  const fatGrams = Math.round((dailyCalories * fatPercent) / 9);
  const carbsGrams = Math.round((dailyCalories * carbsPercent) / 4);

  // Fiber calculation
  let fiberGrams = gender === 'Female' ? 25 : 38;
  if (age > 50) fiberGrams -= 5;

  // 5. Water Intake (35ml per kg of weight, with activity adjustment)
  let waterIntake = Math.round(weight * 35);
  if (activityLevel === 'Very Active') waterIntake += 500;
  if (activityLevel === 'Moderately Active') waterIntake += 250;

  // 6. Food recommendations based on Preferences
  let foodsToEat = [];
  let foodsToAvoid = [];
  let suggestedMeals = [];

  if (dietaryPreference === 'Vegetarian') {
    foodsToEat = ['Lentils & Beans', 'Tofu & Tempeh', 'Greek Yogurt', 'Eggs (if lacto-ovo)', 'Nuts & Seeds', 'Oats', 'Broccoli', 'Spinach', 'Quinoa'];
    foodsToAvoid = ['Beef', 'Pork', 'Chicken', 'Turkey', 'Fish', 'Seafood'];
    suggestedMeals = [
      { meal: 'Breakfast', menu: 'Oatmeal topped with almonds, chia seeds, and strawberries' },
      { meal: 'Lunch', menu: 'Quinoa bowl with spinach, tofu, cucumbers, and a olive oil dressing' },
      { meal: 'Dinner', menu: 'Lentil soup with a side of whole-wheat toast and butter' },
      { meal: 'Snack', menu: 'Greek yogurt with blueberries' }
    ];
  } else if (dietaryPreference === 'Vegan') {
    foodsToEat = ['Lentils & Chickpeas', 'Tofu', 'Almonds & Walnuts', 'Avocado', 'Brown Rice', 'Oats', 'Sweet Potato', 'Spinach', 'Chia Seeds'];
    foodsToAvoid = ['Meat', 'Poultry', 'Fish', 'Eggs', 'Dairy Products (Milk, Cheese, Yogurt)', 'Butter', 'Honey'];
    suggestedMeals = [
      { meal: 'Breakfast', menu: 'Chia seed pudding with almond milk and strawberries' },
      { meal: 'Lunch', menu: 'Chickpea salad with cucumber, tomato, avocado, and spinach' },
      { meal: 'Dinner', menu: 'Tofu stir-fry with broccoli, carrots, and brown rice' },
      { meal: 'Snack', menu: 'A handful of cashews and an apple' }
    ];
  } else if (dietaryPreference === 'Keto') {
    foodsToEat = ['Avocado', 'Eggs', 'Salmon', 'Chicken Breast (cooked with skin)', 'Beef', 'Bacon', 'Cheddar Cheese', 'Butter', 'Olive Oil', 'Spinach'];
    foodsToAvoid = ['White Rice', 'Brown Rice', 'Bread', 'Sweet Potato', 'Potato', 'Oats', 'Sugary Juice', 'Honey', 'High-sugar fruits (Banana)'];
    suggestedMeals = [
      { meal: 'Breakfast', menu: 'Scrambled eggs in butter with spinach and bacon' },
      { meal: 'Lunch', menu: 'Grilled salmon salad with avocado and olive oil' },
      { meal: 'Dinner', menu: 'Baked chicken breast topped with cheddar cheese and broccoli' },
      { meal: 'Snack', menu: 'Walnuts or avocado slices' }
    ];
  } else {
    // Non-Veg or Any
    foodsToEat = ['Chicken Breast', 'Salmon', 'Eggs', 'Whole Wheat Bread', 'Sweet Potato', 'Broccoli', 'Apples', 'Banana', 'Greek Yogurt', 'Oats'];
    foodsToAvoid = ['Deep fried foods', 'Sugary carbonated drinks', 'Processed meats', 'Excess refined sugar'];
    suggestedMeals = [
      { meal: 'Breakfast', menu: 'Boiled eggs, whole-wheat toast with avocado' },
      { meal: 'Lunch', menu: 'Grilled chicken breast with brown rice and broccoli' },
      { meal: 'Dinner', menu: 'Baked salmon with sweet potato and spinach salad' },
      { meal: 'Snack', menu: 'Apple slices with peanut butter' }
    ];
  }

  // 7. Adjustments based on Medical Conditions
  const lowerConditions = (medicalConditions || '').toLowerCase();
  if (lowerConditions.includes('hypertension') || lowerConditions.includes('blood pressure')) {
    foodsToAvoid.push('Processed canned food (high sodium)', 'Pickles', 'Salted nuts');
    foodsToEat.push('Potassium-rich foods (Bananas, Spinach, Sweet Potatoes)');
  }
  if (lowerConditions.includes('diabetes') || lowerConditions.includes('sugar')) {
    foodsToAvoid.push('Fruit juices', 'White bread', 'Refined sugar products', 'High GI foods');
    foodsToEat.push('High fiber grains (Oats, Lentils)', 'Leafy greens');
  }
  if (lowerConditions.includes('cholesterol') || lowerConditions.includes('heart')) {
    foodsToAvoid.push('Butter', 'Bacon', 'Deep-fried foods', 'Trans fats');
    foodsToEat.push('Oats (Beta-glucan)', 'Olive oil', 'Walnuts', 'Salmon (Omega-3)');
  }

  return {
    dailyCalories,
    macros: {
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
      fiber: fiberGrams
    },
    suggestedMeals,
    foodsToEat: [...new Set(foodsToEat)],
    foodsToAvoid: [...new Set(foodsToAvoid)],
    waterIntake
  };
};

// @desc    Update user profile & calculate BMI
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel, goal, dietaryPreference, medicalConditions } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Set properties
    if (age !== undefined) user.age = Number(age);
    if (gender !== undefined) user.gender = gender;
    if (height !== undefined) user.height = Number(height);
    if (weight !== undefined) user.weight = Number(weight);
    if (activityLevel !== undefined) user.activityLevel = activityLevel;
    if (goal !== undefined) user.goal = goal;
    if (dietaryPreference !== undefined) user.dietaryPreference = dietaryPreference;
    if (medicalConditions !== undefined) user.medicalConditions = medicalConditions;

    // Recalculate BMI
    user.bmi = calculateBmi(user.weight, user.height);

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI recommendations based on profile
// @route   GET /api/users/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const recommendations = generateRecommendations(user);
    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of assigned clients (Dietitian only)
// @route   GET /api/users/clients
// @access  Private (Dietitian/Admin)
const getClients = async (req, res) => {
  try {
    // For admin, return all users. For dietitian, return only assigned clients
    let query = {};
    if (req.user.role === 'Dietitian') {
      const dietitian = await User.findById(req.user.id).populate('clients', '-password');
      return res.json({ success: true, clients: dietitian.clients });
    } else if (req.user.role === 'Admin') {
      const clients = await User.find({ role: 'User' }).select('-password');
      return res.json({ success: true, clients });
    }
    return res.status(403).json({ success: false, message: 'Not authorized' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign a client user to a dietitian
// @route   POST /api/users/clients/assign
// @access  Private (Dietitian)
const assignClientToDietitian = async (req, res) => {
  try {
    const { clientEmail } = req.body;
    const client = await User.findOne({ email: clientEmail, role: 'User' });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client user not found' });
    }

    const dietitian = await User.findById(req.user.id);
    if (dietitian.clients.includes(client._id)) {
      return res.status(400).json({ success: false, message: 'Client already assigned to you' });
    }

    dietitian.clients.push(client._id);
    await dietitian.save();

    res.json({ success: true, message: 'Client successfully assigned', client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list (Admin only)
// @route   GET /api/users/admin/all
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).select('-password');
    res.json({ success: true, users: allUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/users/admin/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (userToDelete.role === 'Admin') {
      return res.status(400).json({ success: false, message: 'Admin accounts cannot be deleted' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateProfile,
  getRecommendations,
  getClients,
  assignClientToDietitian,
  getAllUsers,
  deleteUser
};
