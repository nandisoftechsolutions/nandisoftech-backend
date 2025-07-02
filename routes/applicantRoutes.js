// FILE: routes/applicantRoutes.js
const express = require('express');
const router = express.Router();
const { updateApplicantStatus } = require('../controllers/applicantController');

// Changed param from ':applicantId' to '/applicant/:id' for clarity & safety
router.patch('/applicant/:id/status', updateApplicantStatus);

module.exports = router;
