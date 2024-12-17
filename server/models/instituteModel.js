const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
  {
    instituteType: {
      type: String,
      required: true,
      enum: ["School", "University"],
    },
    instituteName: {
      type: String,
      required: true,
    },
    instituteId: {
      type: String,
      required: true,
      unique: true, // To ensure unique IDs for institutes
    },
    boardType: {
      type: [String],
      enum: ["ICSE", "CBSE", "State Board"], // Enum for predefined board types
    },
    level: {
      //which is assessment ID
      type: String,
      required: true,
    },
    program: {
      type: [String], // Example: Undergraduate, Postgraduate, etc.
      trim: true,
    },
    department: {
      type: [String], // Example: B.tech, M.tech, etc.
      trim: true,
    },
    year: {
      type: String, // Example: "1st", "2nd", "3rd", "4th"
      enum: ["1st", "2nd", "3rd", "4th"],
    },
    isEmail_required: {
      type: Boolean,
      required: true,
      default: true,
    },
    isPhone_required: {
      type: Boolean,
      required: true,
      default: true,
    },
    isGuardianPhone_required: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Institute = mongoose.model("Institute", instituteSchema);

module.exports = Institute;
