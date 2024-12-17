const Response = require("../models/responseModel");
const Assessment = require("../models/assessmentModel");
const Report = require("../models/reportModel");

//  Function to upload Assessment in DB
const uploadAssessment = async (req, res) => {
  try {
    const {
      language,
      assessmentId,
      board,
      classId,
      level,
      program,
      department,
    } = req.body;

    // Validate request data
    if (!assessmentId || !level) {
      return res.status(400).json({
        statusCode: 400,
        status: "Validation Error",
        message: "Missing required fields: language, assessmentID, board",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        statusCode: 400,
        status: "Validation Error",
        message: "Missing assessment file",
      });
    }

    // Parse the uploaded JSON file
    const fileContent = JSON.parse(req.file.buffer.toString());

    // Save to MongoDB
    const newAssessment = new Assessment({
      language,
      assessmentId,
      board,
      classId,
      level,
      program,
      department,
      assessment: fileContent, // Store parsed JSON here
    });

    const savedAssessment = await newAssessment.save();

    res.status(201).json({
      statusCode: 201,
      status: "Success",
      message: "Assessment uploaded successfully",
      body: {
        id: savedAssessment._id,
        assessmentId: savedAssessment.assessmentId,
        language: savedAssessment.language,
      },
    });
  } catch (error) {
    console.error("Error uploading assessment:", error.message);
    res.status(500).json({
      statusCode: 500,
      status: "Server Error",
      message: "Failed to upload assessment",
      error: error.message,
    });
  }
};

// Function to download assessment data from MongoDB
const downloadAssessment = async (req, res) => {
  const { assessmentId } = req.params;

  // We can extract classNumber if needed
  // const classNumber = assessmentID.split("_")[1]; // e.g., if assessmentID is "assessment_10", classNumber will be "10"
  try {
    const assessmentData = await Assessment.findOne({
      assessmentId,
    });
    // Check if the assessment data was found
    if (!assessmentData) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: `No assessment exists for ${assessmentId}`,
      });
    }

    // Respond with the assessment data
    res.status(200).json({
      statusCode: 200,
      status: "Success",
      message: `Assessment data fetched successfully for ${assessmentId}`,
      body: assessmentData, // Return the document as the response body
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: `Failed to fetch assessment data for ${assessmentId}`,
      error: error.message, // Provide error message
    });
  }
};

// // Function to get assessments list based on language and board
// const getAssessmentsList = async (req, res) => {
//   const { language, board } = req.params;

//   // Validate input
//   if (!language || !board) {
//     return res.status(400).json({
//       statusCode: 400,
//       status: "Bad Request",
//       message: "Both language and board are required as parameters.",
//     });
//   }

//   try {
//     // Query MongoDB to fetch assessments with the given language and board
//     const assessments = await Assessment.find({ language, board }).select(
//       "assessmentID"
//     );

//     // If no assessments are found, return a message
//     if (assessments.length === 0) {
//       return res.status(404).json({
//         statusCode: 404,
//         status: "Not Found",
//         message: `No assessments found for language: ${language} and board: ${board}`,
//       });
//     }

//     res.status(200).json({
//       statusCode: 200,
//       status: "Success",
//       message: "Assessments fetched successfully",
//       assessments: assessments.map((assessment) => assessment.assessmentID), // Extract only assessmentID
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       statusCode: 500,
//       status: "Internal Server Error",
//       message: "Failed to fetch assessments",
//       error: error.message,
//     });
//   }
// };

// Controller function to handle response submission
const uploadResponse = async (req, res) => {
  // The request body (expected to be JSON)
  const data = req.body;

  // Create a new response document
  const filteredData = {
    studentId: data.studentId,
    name: data.name,
    classId: data.classId,
    rollNumber: data.rollNumber,
    instituteName: data.instituteName,
    instituteId: data.instituteId,
    department: data.department,
    program: data.program,
    year: data.year,
    email: data.email,
    board: data.board,
    phoneNo: data.phoneNo,
    guardianPhoneNo: data.guardianPhoneNo,
    section: data.section,
    assessmentId: data.assessmentId,
    uniqueId: data.uniqueId,
    responses: data.responses,
  };

  try {
    // Save the response to MongoDB
    const response = new Response(filteredData);
    await response.save();
    // Send a success response
    res.status(201).json({
      statusCode: 201,
      status: "Success",
      message: "Response uploaded successfully",

      data: response,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      statusCode: 500,
      status: "Error",
      message: "Failed to upload response",
      error: error.message,
    });
  }
};

// Fetch Response for a specific student, assessment, and school
const getResponseData = async (req, res) => {
  const { instituteId, studentId, assessmentId } = req.params;

  try {
    // Query MongoDB to find the response based on the parameters
    const response = await Response.findOne({
      instituteId,
      studentId,
      assessmentId,
    });

    // If no response is found
    if (!response) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: "Response not found",
      });
    }

    // Send the response data as JSON
    res.status(200).json({
      statusCode: 200,
      status: "Success",
      message: "Response data fetched successfully",
      body: response.responses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: "Error fetching the response data from MongoDB",
      error: error.message,
    });
  }
};

// Function to get assessment report from MongoDB
const getAssessmentReport = async (req, res) => {
  const { instituteId, studentId, assessmentId } = req.params;

  try {
    // Fetch the report from the database
    const report = await Report.findOne({
      instituteId,
      studentId,
      assessmentId,
    });

    if (!report) {
      return res.status(404).send("Report not found");
    }

    // Return the report data (the reportData field)
    res.json(report.reportData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching the report from MongoDB");
  }
};

// upload PDF report URL in DB
const uploadPDF = async (req, res) => {
  const { instituteId, studentId, assessmentId } = req.params;
  const { pdfURL } = req.body;

  if (!pdfURL) {
    return res.status(400).json({
      statusCode: 400,
      status: "Validation Error",
      message: "Missing required fields: pdfURL",
    });
  }

  try {
    // Find and update or create a new report entry in MongoDB
    const report = await Report.findOneAndUpdate(
      { instituteId, studentId, assessmentId }, // Search condition
      { pdfURL }, // Data to insert or update
      { upsert: true, new: true } // Create if not exists, return updated document
    );

    res.status(200).json({
      statusCode: 200,
      status: "Success",
      message: "PDF URL saved successfully to MongoDB",
      body: {
        instituteId,
        studentId,
        assessmentId,
        pdfURL: report.pdfURL,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      status: "Database Error",
      message: "Failed to save PDF URL to MongoDB",
      error: error.message,
    });
  }
};

module.exports = {
  uploadAssessment,
  downloadAssessment,
  // getAssessmentsList,
  uploadResponse,
  getResponseData,
  getAssessmentReport,
  uploadPDF,
};
