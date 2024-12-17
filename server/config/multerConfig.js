const multer = require("multer");

// Configure Multer to handle file uploads in memory
const storage = multer.memoryStorage();

// File filter for JSON files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/json") {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only JSON files are allowed"), false); // Reject file
  }
};

// Multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
