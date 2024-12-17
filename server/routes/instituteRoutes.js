const express = require("express");
const router = express.Router();
const {
  getAllInstitutes,
  addInstitute,
} = require("../controllers/instituteController");
const {
  addValidInstitute,
  validateInstituteID,
} = require("../controllers/validInstituteControllers");

// Route to fetch all schools
router.get("/getAllInstitutes", getAllInstitutes);

// Route to add a new school
router.post("/addInstitute", addInstitute);

// Route for add Valid Institute
router.post("/add-valid-Institute", addValidInstitute);

// Route for Validate Institute
router.post("/validate-InstituteID", validateInstituteID);
module.exports = router;
