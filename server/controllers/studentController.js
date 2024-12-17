//const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/mailSender");
const Student = require("../models/studentModel");
const Feedback = require("../models/feedbackModel");
const Institute = require("../models/instituteModel");
const {
  getNextStudentId,
  getNextInstituteId,
} = require("../helpers/idGenerator");
const { generateRandomPassword } = require("../helpers/passwordGenerator");

// Register Student
const registerStudent = async (req, res) => {
  const {
    classId,
    fullName,
    rollNumber,
    instituteName,
    board,
    department,
    program,
    year,
    phoneNo,
    guardianPhoneNo,
    email,
    section,
  } = req.body;

  // Check for missing fields
  const requiredFields = ["fullName", "rollNumber", "instituteName"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    const missingFieldsMessage = `Missing fields: ${missingFields.join(", ")}`;
    return res.status(400).json({
      statusCode: 400,
      status: "Bad Request",
      message: missingFieldsMessage,
    });
  }

  try {
    // Check if the student is already registered using the email

    // const existingStudent = await Student.findOne({ email });
    // if (existingStudent) {
    //   return res.status(400).json({
    //     statusCode: 400,
    //     status: "Bad Request",
    //     message: "Student already registered. Please log in.",
    //   });
    // }

    // Check if the institute exists, if not, generate a new instituteId
    let institute = await Institute.findOne({ instituteName });
    let instituteId;

    if (!institute) {
      // Get the institute with the highest institute_id
      const lastInstitute = await Institute.findOne().sort({
        instituteId: -1,
      });
      const lastInstituteId = lastInstitute ? lastInstitute.instituteId : null;

      // Generate the next institute_id
      instituteId = getNextInstituteId(lastInstituteId);

      // Create and save the new institute
      institute = new Institute({ instituteName, instituteId });
      await institute.save();
    } else {
      // If institute exists, use the existing institute_id
      instituteId = institute.instituteId;
    }

    // Generate random password
    const rawPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Generate the next studentId based on the last registered student
    const lastStudent = await Student.findOne().sort({ studentId: -1 });
    const newStudentId = lastStudent
      ? getNextStudentId(lastStudent.studentId)
      : "AAAAAA1";

    // console.log("rawPassword->", rawPassword);

    // Create a new student
    const newStudent = new Student({
      classId,
      fullName,
      rollNumber,
      instituteName,
      board,
      department,
      program,
      year,
      phoneNo,
      guardianPhoneNo,
      email,
      section,
      studentId: newStudentId,
      instituteId,
      password: hashedPassword,
    });

    // Save the student data
    await newStudent.save();

    // Send the password to the student's email

    // await sendEmail(
    //   email,
    //   "Your Account Registration Password",
    //   `Hello ${fullName},<br><br>Your account has been created successfully. Your password is: <strong>${rawPassword}</strong><br><br>Please keep it secure.`
    // );

    res.status(201).json({
      statusCode: 201,
      status: "Success",
      message: "Student registered successfully",
      body: {
        studentId: newStudent.studentId,
        fullName: newStudent.fullName,
        rollNumber: newStudent.rollNumber,
        instituteId: newStudent.instituteId,
        instituteName: newStudent.instituteName,
      }, // Return only necessary fields
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: "Failed to register student",
      error: error.message,
    });
  }
};

// Login Student
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      status: "Bad Request",
      message: "Email and Password are required",
    });
  }

  try {
    // Check if student exists
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: "Student not found",
      });
    }

    // Compare password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        status: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const payload = {
      email: student.email,
      studentId: student.studentId,
      instituteId: student.instituteId,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token and student info in response
    res.status(200).json({
      statusCode: 200,
      status: "Success",
      message: "Login successful",
      token: token,
      student: {
        fullName: student.fullName,
        email: student.email,
        studentId: student.studentId,
        instituteId: student.instituteId,
      },
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: "Failed to login",
      error: error.message,
    });
  }
};

//  Student Feedback
const registerFeedback = async (req, res) => {
  const { email, studentId, rating, feedback } = req.body;

  // Validate required fields
  if (!email || !studentId || rating == null || !feedback) {
    return res.status(400).json({
      statusCode: 400,
      message: "Missing required fields",
    });
  }

  // Validate rating range
  if (rating < 0 || rating > 5) {
    return res.status(400).json({
      statusCode: 400,
      message: "Rating must be between 0 and 5",
    });
  }

  try {
    // Save feedback to MongoDB
    const newFeedback = new Feedback({ email, studentId, rating, feedback });
    await newFeedback.save();

    res.status(200).json({
      statusCode: 200,
      message: "Feedback stored successfully",
      body: newFeedback,
    });
  } catch (error) {
    console.error("Error storing feedback:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Error storing feedback",
      error: error.message,
    });
  }
};

module.exports = { registerStudent, loginStudent, registerFeedback };
