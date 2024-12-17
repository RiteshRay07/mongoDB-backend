// Helper to increment prefix for alphanumeric IDs
const incrementPrefix = (prefix) => {
    const prefixArray = prefix.split("");
    for (let i = prefixArray.length - 1; i >= 0; i--) {
      if (prefixArray[i] !== "Z") {
        prefixArray[i] = String.fromCharCode(prefixArray[i].charCodeAt(0) + 1);
        return prefixArray.join("");
      }
      prefixArray[i] = "A"; // Reset to 'A' and move to the previous character
    }
    return prefixArray.join("");
  };
  
  // Generate the next alphanumeric ID for students
  const getNextStudentId = (lastStudentId) => {
    if (!lastStudentId) return "AAAAAA1"; // Default starting ID
  
    const prefix = lastStudentId.slice(0, -1); // Alphabetical part
    const suffix = parseInt(lastStudentId.slice(-1)); // Numeric part
  
    if (suffix < 9) {
      return `${prefix}${suffix + 1}`;
    }
  
    const nextPrefix = incrementPrefix(prefix);
    return `${nextPrefix}1`;
  };
  
  // Generate the next alphanumeric ID for institutes
  const getNextInstituteId = (lastInstituteId) => {
    if (!lastInstituteId) return "AAAAAA1"; // Default starting ID
  
    const prefix = lastInstituteId.slice(0, -1); // Alphabetical part
    const suffix = parseInt(lastInstituteId.slice(-1), 10); // Numeric part
  
    if (suffix < 9) {
      return `${prefix}${suffix + 1}`; // Increment the numeric part
    }
  
    // If numeric part reaches 9, reset it to 1 and increment the prefix
    const nextPrefix = incrementPrefix(prefix);
    return `${nextPrefix}1`;
  };
  
  module.exports = { getNextStudentId, getNextInstituteId };
  