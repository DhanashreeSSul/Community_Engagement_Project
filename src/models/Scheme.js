const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    launchedBy: { type: String, required: true },
    type: { type: String, enum: ["Central", "State"], required: true },
    residence: { type: String, enum: ["Rural", "Urban"], required: true },
    occupation: { type: String, enum: ["Farmer", "Fisher", "Entrepreneur"], required: true },
    objective: { type: String, required: true },
    features: { type: String, required: true },
    eligibility: { type: String, required: true },
    link: { type: String, required: true }
});

module.exports = mongoose.model("Scheme", schemeSchema);
