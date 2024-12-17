const mongoose = require("mongoose");

const validInstituteSchema = new mongoose.Schema({
  uniqueID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default to the current date
    expires: '7d',    // Automatically delete after 7 days
    //expires: 120, // Automatically delete after 120 seconds (2 minutes)
  },
});

const validInstitute = mongoose.model("validInstitute", validInstituteSchema);

module.exports = validInstitute;
