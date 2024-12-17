const Institute = require("../models/instituteModel");
const { getNextInstituteId } = require("../helpers/idGenerator");

// Get all institutes
const getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find().select("instituteName -_id");

    res.status(200).json({
      statusCode: 200,
      status: "Success",
      message: "Institutes list fetched successfully",
      body: institutes.map((institute) => institute.instituteName),
    });
  } catch (error) {
    console.error("Error fetching institutes:", error.message);

    res.status(500).json({
      statusCode: 500,
      status: "Server Error",
      message: "Failed to fetch institutes",
      error: error.message,
    });
  }
};

// Add a new institute
const addInstitute = async (req, res) => {
  try {
    const {
      instituteType,
      instituteName,
      boardType,
      level,
      program,
      department,
      year,
      isEmail_required,
      isPhone_required,
      isGuardianPhone_required,
    } = req.body;

    // Validate required fields
    if (!instituteType || !instituteName || !level) {
      return res.status(400).json({
        statusCode: 400,
        status: "Validation Error",
        message: "Missing required fields: instituteType, instituteName, level",
      });
    }

    // Get the last institute's instituteId to generate the next one
    const lastInstitute = await Institute.findOne()
      .sort({ createdAt: -1 })
      .select("instituteId");
    const instituteId = getNextInstituteId(
      lastInstitute ? lastInstitute.instituteId : null
    );

    // Create and save the new institute
    const newInstitute = new Institute({
      instituteType,
      instituteName,
      instituteId,
      boardType,
      level,
      program,
      department,
      year,
      isEmail_required,
      isPhone_required,
      isGuardianPhone_required,
    });

    const savedInstitute = await newInstitute.save();

    res.status(201).json({
      statusCode: 201,
      status: "Success",
      message: "Institute added successfully",
      body: savedInstitute,
    });
  } catch (error) {
    console.error("Error adding institute:", error.message);
    res.status(500).json({
      statusCode: 500,
      status: "Server Error",
      message: "Failed to add institute",
      error: error.message,
    });
  }
};

module.exports = { getAllInstitutes, addInstitute };
