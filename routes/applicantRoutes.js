// FILE: routes/applicantRoutes.js
const express = require('express');
const router = express.Router();
const { updateApplicantStatus } = require('../controllers/applicantController');

router.patch('/:applicantId/status', updateApplicantStatus);

module.exports = router;