const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER, // Your email address from environment variables
    pass: process.env.MAIL_PASS, // Your email password or app password from environment variables
  },
});

// Function to send an email
const sendEmail = async (to, subject, body, attachments = []) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html: body,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
