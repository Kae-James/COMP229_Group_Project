const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        // title String Required, e.g. “Exercise four times a week” 
        title: {
            type : String,
            required: true,
            trim: true
        },
        category: {
            type : String,
            required: true,
            enum: ["workout", "sleep", "nutrition", "other"]
        },
        targetValue: {
            type : Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: false
        },
        status : {
            type : String,
            required: true,
            enum: ["active", "achieved", "cancelled"],
            default: "active"
        },
        owner : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Goal", goalSchema, "goals");