// models/reportModel.js
const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../config/mailSender");

// Ensure the temp directory exists
const tempDir = path.resolve(__dirname, "../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const reportSchema = new mongoose.Schema({
  instituteId: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  assessmentId: {
    type: String,
    required: true,
  },
  reportData: {
    type: Object,
  },
  pdfURL: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Function to download PDF
async function downloadPDF(url, studentId) {
  const filePath = path.resolve(tempDir, `${studentId}.pdf`);
  const writer = fs.createWriteStream(filePath);

  try {
    // console.log(`Downloading PDF from: ${url}...`);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    // Pipe the response data to the writer
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        // Check if file was written successfully
        if (fs.existsSync(filePath)) {
          console.log(`PDF downloaded successfully: ${filePath}`);
          resolve(filePath);
        } else {
          console.error(`PDF download failed: ${filePath}`);
          reject(new Error("Failed to download the PDF."));
        }
      });
      writer.on("error", (error) => {
        console.error("Error downloading PDF:", error.message);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error during PDF download:", error.message);
    throw error;
  }
}

// Post-save hook to send an email
// reportSchema.post("findOneAndUpdate", async function (doc) {
//   try {
//     const { pdfURL, reportData, studentId } = doc;

//     // Extract student email from reportData
//     const studentEmail = reportData.result.student_details.email;
//     if (!studentEmail) {
//       console.error("Student email not found in reportData.");
//       return;
//     }

//     // Download the PDF
//     const filePath = await downloadPDF(pdfURL, studentId);

//     // Check if the file was downloaded
//     if (!fs.existsSync(filePath)) {
//       console.error("PDF file was not downloaded properly.");
//       return;
//     }

//     // Send the email with the PDF attached

//     await sendEmail(
//       studentEmail,
//       "Your Assessment Report",
//       `Dear Student,<br><br>Your assessment report is attached to this email.<br><br>Regards,<br>Assessli Team`,
//       [
//         {
//           filename: "assessment-report.pdf",
//           path: filePath, // Attach the downloaded PDF
//         },
//       ]
//     );

//     console.log(`Email with PDF sent to ${studentEmail}`);

//     // Clean up the downloaded file
//     fs.unlinkSync(filePath);
//     console.log(`PDF file removed from temp folder: ${filePath}`);
//   } catch (error) {
//     console.error("Error in sending email with PDF:", error.message);
//   }
// });

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
