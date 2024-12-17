const axios = require("axios");
const Report = require("../models/reportModel");
require("dotenv").config();

// Function to send data to an external API
const sendResponseToAPI = async (doc) => {
  console.log("sendResponseToAPI", doc);
  try {
    const apiUrl = process.env.REPORT_API_URL;
    const payload = {
      student_id: doc.studentId,
      name: doc.name,
      class: doc.classId,
      roll_number: doc.rollNumber,
      schoolName: doc.instituteName,
      schoolId: doc.instituteId,
      email: doc.email,
      board: doc.board,
      department: doc.department,
      program: doc.program,
      year: doc.year,
      phoneNo: doc.phoneNo,
      section: doc.section,
      guardianPhoneNo: doc.guardianPhoneNo,
      assessment_id: doc.assessmentId,
      uniqueId: doc.uniqueId,
      responses: doc.responses,
      timestamp: doc.timestamp,
    };
    console.log("Payload is ->", payload);
    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Data sent successfully to the API:", response.data);

    //========= Save the response to the REPORT database==========
    const reportData = {
      instituteId: doc.instituteId,
      studentId: doc.studentId,
      assessmentId: doc.assessmentId,
      reportData: response.data.result,
      pdfURL: response.data.pdfURL || null,
    };

    const savedReport = await Report.create(reportData);
    console.log(
      "API response saved to the database successfully:",
      savedReport
    );

    return savedReport;
  } catch (error) {
    if (error.response) {
      console.error("Error Status:", error.response.status);
      console.error("Error Data:", error.response.data);
      console.error("Error Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error Setting Up Request:", error.message);
    }
  }
};

module.exports = sendResponseToAPI;
