// models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"], // Basic email format validation
  },
  studentId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  feedback: {
    type: String,
    default: "",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
