const mongoose = require('mongoose');
const User = require('../models/User');
const Food = require('../models/Food');

const initialFoods = [
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
  { name: 'Chicken Breast (cooked)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { name: 'White Rice (cooked)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  { name: 'Brown Rice (cooked)', calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
  { name: 'Oats', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6 },
  { name: 'Egg (boiled)', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  { name: 'Salmon (cooked)', calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 },
  { name: 'Milk (whole)', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
  { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 49, fiber: 12 },
  { name: 'Broccoli (raw)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
  { name: 'Greek Yogurt (plain)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0 },
  { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 },
  { name: 'Bread (whole wheat)', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7 },
  { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 },
  { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
  { name: 'Beef (lean ground cooked)', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
  { name: 'Tuna (canned)', calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0 },
  { name: 'Potato (boiled)', calories: 87, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8 },
  { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
  { name: 'Strawberry', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2 },
  { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 },
  { name: 'Cucumber', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
  { name: 'Tomato', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  { name: 'Carrot', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
  { name: 'Cheese (Cheddar)', calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
  { name: 'Butter', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 },
  { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  { name: 'Honey', calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
  { name: 'Tofu', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 },
  { name: 'Lentils (cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9 },
  { name: 'Chickpeas (cooked)', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6 },
  { name: 'Walnuts', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 },
  { name: 'Cashews', calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3 },
  { name: 'Chia Seeds', calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34 },
  { name: 'Quinoa (cooked)', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 },
  { name: 'Black Beans (cooked)', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7 },
  { name: 'Whey Protein Powder', calories: 400, protein: 80, carbs: 6, fat: 6, fiber: 0 },
  { name: 'Green Tea', calories: 1, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  { name: 'Coffee (black)', calories: 2, protein: 0.1, carbs: 0, fat: 0, fiber: 0 },
  { name: 'Water', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  { name: 'Orange Juice', calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2, fiber: 0.2 },
  { name: 'Apple Juice', calories: 46, protein: 0.1, carbs: 11.3, fat: 0.1, fiber: 0.2 },
  { name: 'Popcorn (air-popped)', calories: 387, protein: 12.9, carbs: 78, fat: 4.5, fiber: 14.5 },
  { name: 'Dark Chocolate (70%)', calories: 600, protein: 7, carbs: 46, fat: 43, fiber: 8 },
  { name: 'Egg White', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 },
  { name: 'Turkey Breast', calories: 104, protein: 22, carbs: 0, fat: 2, fiber: 0 },
  { name: 'Pork Chop', calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0 },
  { name: 'Bacon', calories: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0 },
  { name: 'Coconut Oil', calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0 }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutriguide');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed Admin if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'suryaadmin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log('Seeding admin user...');
      const admin = new User({
        name: 'Surya Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || '123456789',
        role: 'Admin',
        age: 30,
        gender: 'Male',
        height: 175,
        weight: 70,
        bmi: 22.86,
        activityLevel: 'Moderately Active',
        goal: 'Maintain Weight',
        dietaryPreference: 'Any'
      });
      await admin.save();
      console.log('Admin user seeded successfully.');
    }

    // Seed Food database if empty
    const foodCount = await Food.countDocuments();
    if (foodCount === 0) {
      console.log('Seeding initial food items...');
      await Food.insertMany(initialFoods);
      console.log(`${initialFoods.length} food items seeded successfully.`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
