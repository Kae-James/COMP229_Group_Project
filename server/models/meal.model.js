
const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },
        mealType: {
            type: String,
            required: true,
            enum: ["breakfast", "lunch", "dinner", "snack"]
        },
        foodItems: {
            type: String,
            required: true
        },
        calories: {
            type: Number,
            required: true,
            min: 0
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

module.exports = mongoose.model("Meal", mealSchema, "meals");
