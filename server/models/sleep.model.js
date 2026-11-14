
const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },
        hoursSlept: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        },
        notes: {
            type: String
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

module.exports = mongoose.model("Sleep", sleepSchema, "sleeplogs");
