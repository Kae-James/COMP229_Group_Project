require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Public health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/workouts", require("./routes/workout.routes"));
app.use("/api/sleep", require("./routes/sleep.routes"));
app.use("/api/meals", require("./routes/meal.routes"));
app.use("/api/goals", require("./routes/goal.routes"));

// Unknown route
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Central error handler (Express 5 forwards async errors here)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: "Email is already in use" });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}/api`));
});
