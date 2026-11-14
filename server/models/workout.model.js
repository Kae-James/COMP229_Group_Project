
const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    exerciseType: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      required: true
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1
    },

    caloriesBurned: {
      type: Number,
      required: true,
      min: 0
    },

    notes: {
      type: String,
      maxlength: 500
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Workout", workoutSchema, "workouts");
