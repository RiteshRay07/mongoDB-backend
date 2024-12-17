const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const {
  uploadResponse,
  getResponseData,
  downloadAssessment,
  uploadPDF,
  getAssessmentReport,
  // getAssessmentsList,
  uploadAssessment,
} = require("../controllers/assessmentController");

// Route for uploading response
router.post(
  "/upload-response",
  uploadResponse
);

// Route to fetch the response data for a specific student, assessment, and school
router.get(
  "/download-new-responseJSON/:instituteId/:studentId/:assessmentId",
  getResponseData
);

// Define the route to download assessment data
router.get("/assessment/:assessmentId", downloadAssessment);

// Define the route to upload report pdf
router.post("/upload_pdf_url/:instituteId/:studentId/:assessmentId", uploadPDF);

// Define the route to fetch the report
router.get(
  "/get-report/:instituteId/:studentId/:assessmentId",
  getAssessmentReport
);

// Route to fetch assessments list by language and board
// router.get("/list/:language/:board", getAssessmentsList);

// Route to upload assessment
router.post("/upload_assessment", upload.single("file"), uploadAssessment);

module.exports = router;
