const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const instituteRoutes = require("./routes/instituteRoutes");
dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Configure CORS to allow frontend-backend communication
const corsOptions = {
  origin: process.env.BASE_URL, // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};
app.use(cors(corsOptions));

// Test route to check if the server is running
app.get("/", (req, res) => {
  res.send("Yes, Server is up and running!");
});

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/institute", instituteRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
