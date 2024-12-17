const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  language: {
    type: String,
  },
  assessmentId: {
    type: String,
    required: true,
  },
  classId: {
    type: String,
  },
  level: {
    type: String,
    required: true,
  },
  program: {
    type: String,
  },
  department: {
    type: String,
  },
  board: {
    type: String,
    enum: ["ICSE", "CBSE", "State Board"],
    message: "{VALUE} is not a valid board type",
  },
  assessment: {
    type: Object,
    required: true,
  },
});

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
