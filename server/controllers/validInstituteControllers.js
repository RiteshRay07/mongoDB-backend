const validInstitute = require("../models/validInstituteModel");
const { v4: uuidv4 } = require("uuid");

// Add Institute with Token
const addValidInstitute = async (req, res) => {
  const { uniqueID, name } = req.body;

  try {
    const token = uuidv4(); // Generate a unique token

    const valid_institute = new validInstitute({
      uniqueID,
      name,
      token,
    });
    await valid_institute.save();

    res.status(201).json({
      message: "Institute added successfully",
      uniqueID,
      name,
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "Unique ID already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// Validate Unique ID and Fetch Token
const validateInstituteID = async (req, res) => {
  const { uniqueID } = req.body;

  try {
    const institute = await validInstitute.findOne({ uniqueID });
    if (institute) {
      res.status(200).json({
        valid: true,
        school: {
          name: institute.name,
          token: institute.token,
        },
      });
    } else {
      res
        .status(400)
        .json({ valid: false, message: "Invalid or Inactive Unique ID" });
    }
  } catch (err) {
    res.status(500).json({ valid: false, message: "Server error" });
  }
};

module.exports = { addValidInstitute, validateInstituteID };
