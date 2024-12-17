const express = require("express");
const {
  registerStudent,
  loginStudent,
  registerFeedback,
} = require("../controllers/studentController");

const router = express.Router();

// Route for registering a student
router.post("/register-student", registerStudent);

// Route for login a student
router.post("/login", loginStudent);

//feedback route
router.post("/register-feedback", registerFeedback);

module.exports = router;
