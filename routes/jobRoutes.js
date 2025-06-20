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
router.put('/:jobId', updateJob);
router.delete('/:jobId', deleteJob);
router.get('/:jobId/applications', getJobApplications);
router.get('/:jobId/applications/count', getJobApplicationsCount);
router.patch('/:jobId/status', updateJobStatus);
router.get('/resume/:resumeName', downloadResume);

module.exports = router;
