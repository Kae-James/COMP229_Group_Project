// Sample data for development and Postman testing.
// Run: npm run seed
// Safe to re-run: it only removes and recreates the sample users below
// and the records they own. Other data is never touched.

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

const User = require("./models/user.model");
const Workout = require("./models/workout.model");
const Sleep = require("./models/sleep.model");
const Meal = require("./models/meal.model");
const Goal = require("./models/goal.model");

const PASSWORD = "Password123!";

const users = [
  { name: "Admin User", email: "admin@activeera.test", role: "admin" },
  { name: "Alice Runner", email: "alice@activeera.test", role: "user" },
  { name: "Bob Lifter", email: "bob@activeera.test", role: "user" },
];

// Date n days ago, at midnight
const daysAgo = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
};

const recordsFor = {
  "alice@activeera.test": {
    workouts: [
      { exerciseType: "running", date: daysAgo(0), durationMinutes: 30, caloriesBurned: 300, notes: "Morning 5K" },
      { exerciseType: "cycling", date: daysAgo(2), durationMinutes: 45, caloriesBurned: 400 },
      { exerciseType: "yoga", date: daysAgo(4), durationMinutes: 60, caloriesBurned: 180, notes: "Recovery session" },
    ],
    sleep: [
      { date: daysAgo(1), hoursSlept: 7.5 },
      { date: daysAgo(2), hoursSlept: 6, notes: "Woke up twice" },
      { date: daysAgo(3), hoursSlept: 8 },
    ],
    meals: [
      { date: daysAgo(0), mealType: "breakfast", foodItems: "Oatmeal with banana", calories: 350 },
      { date: daysAgo(0), mealType: "lunch", foodItems: "Chicken salad", calories: 550 },
      { date: daysAgo(0), mealType: "snack", foodItems: "Greek yogurt", calories: 150 },
    ],
    goals: [
      { title: "Exercise four times a week", category: "workout", targetValue: 4, unit: "workouts per week", startDate: daysAgo(7) },
      { title: "Sleep 8 hours a night", category: "sleep", targetValue: 8, unit: "hours per night", startDate: daysAgo(14) },
    ],
  },
  "bob@activeera.test": {
    workouts: [
      { exerciseType: "weight training", date: daysAgo(1), durationMinutes: 50, caloriesBurned: 350, notes: "Leg day" },
      { exerciseType: "running", date: daysAgo(3), durationMinutes: 20, caloriesBurned: 220 },
    ],
    sleep: [
      { date: daysAgo(1), hoursSlept: 6.5 },
      { date: daysAgo(2), hoursSlept: 7 },
    ],
    meals: [
      { date: daysAgo(0), mealType: "breakfast", foodItems: "Eggs and toast", calories: 420 },
      { date: daysAgo(0), mealType: "dinner", foodItems: "Salmon with rice", calories: 700 },
    ],
    goals: [
      { title: "Eat under 2200 calories a day", category: "nutrition", targetValue: 2200, unit: "calories per day", startDate: daysAgo(10) },
      { title: "Run 10K", category: "workout", targetValue: 10, unit: "km", startDate: daysAgo(30), endDate: daysAgo(2), status: "achieved" },
    ],
  },
};

const seed = async () => {
  await connectDB();

  // Remove previous sample data only
  const emails = users.map((u) => u.email);
  const old = await User.find({ email: { $in: emails } }).select("_id");
  const oldIds = old.map((u) => u._id);
  for (const Model of [Workout, Sleep, Meal, Goal]) {
    await Model.deleteMany({ owner: { $in: oldIds } });
  }
  await User.deleteMany({ _id: { $in: oldIds } });

  const hash = await bcrypt.hash(PASSWORD, 10);
  const created = await User.insertMany(users.map((u) => ({ ...u, password: hash })));

  const counts = { users: created.length, workouts: 0, sleeplogs: 0, meals: 0, goals: 0 };
  for (const user of created) {
    const r = recordsFor[user.email];
    if (!r) continue;
    const withOwner = (list) => list.map((x) => ({ ...x, owner: user._id }));
    counts.workouts += (await Workout.insertMany(withOwner(r.workouts))).length;
    counts.sleeplogs += (await Sleep.insertMany(withOwner(r.sleep))).length;
    counts.meals += (await Meal.insertMany(withOwner(r.meals))).length;
    counts.goals += (await Goal.insertMany(withOwner(r.goals))).length;
  }

  console.log("Seeded:", counts);
  console.log(`Sample logins (password "${PASSWORD}"): ${emails.join(", ")}`);
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
