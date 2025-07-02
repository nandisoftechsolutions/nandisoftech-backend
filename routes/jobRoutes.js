// FILE: routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  addJob,
  updateJob,
  deleteJob,
  getJobApplications,
  getJobApplicationsCount,
  updateJobStatus,
  downloadResume,
} = require('../controllers/jobController');

router.get('/', getAllJobs);
router.post('/', addJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

// Changed to safer param names:
router.get('/job/:id/applications', getJobApplications);
router.get('/job/:id/applications/count', getJobApplicationsCount);
router.patch('/job/:id/status', updateJobStatus);

router.get('/resume/:resumeName', downloadResume);

module.exports = router;
