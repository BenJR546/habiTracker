const { Schema, model } = require("mongoose");

const HabitSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    frequency: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

const Habit = model("Habit", HabitSchema);

module.exports = Habit;
