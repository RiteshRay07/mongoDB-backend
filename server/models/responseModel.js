const mongoose = require("mongoose");
const sendResponseToAPI = require("../utils/sendResponseToApi");

const responseSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  assessmentId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  classId: {
    type: String,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  instituteName: {
    type: String,
    required: true,
  },
  instituteId: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  program: {
    type: String,
  },
  year: {
    type: String,
  },
  email: {
    type: String,
  },
  board: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  guardianPhoneNo: {
    type: String,
  },
  section: {
    type: String,
  },
  uniqueId: {
    type: String,
    // required: true,
  },
  responses: {
    type: Object,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Set up a post-save hook to call afterSaveAction
responseSchema.post("save", function (doc) {
  sendResponseToAPI(doc);
});

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
