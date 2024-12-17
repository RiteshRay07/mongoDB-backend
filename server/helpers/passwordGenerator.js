const crypto = require("crypto");

// Generate a random password
const generateRandomPassword = () => {
  return crypto.randomBytes(4).toString("hex");
};

module.exports = { generateRandomPassword };
