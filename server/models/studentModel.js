const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    classId: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    instituteName: {
      type: String,
      required: true,
    },
    board: {
      type: String,
      enum: ["ICSE", "CBSE", "State Board"],
    },
    department: {
      type: String,
    },
    program: {
      type: String,
    },
    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th"],
    },
    phoneNo: {
      type: String,
    },
    guardianPhoneNo: {
      type: String,
    },
    email: {
      type: String,
    },
    section: {
      type: String,
    },
    studentId: {
      type: String,
      unique: true,
    },
    instituteId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false, // Ensures password is not returned by default
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
