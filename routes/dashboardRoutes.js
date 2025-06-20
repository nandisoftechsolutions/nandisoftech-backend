// FILE: routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard API Endpoints
router.get('/total-orders', dashboardController.getTotalOrders);
router.get('/open-jobs', dashboardController.getOpenJobs);
router.get('/total-applications', dashboardController.getTotalApplications);
router.get('/total-projects', dashboardController.getTotalProjects);
router.get('/total-messages', dashboardController.getTotalMessages);
router.get('/total-users', dashboardController.getTotalUsers);
router.get('/total-blogs', dashboardController.getTotalBlogs);
router.get('/total-coursevideos', dashboardController.getTotalCoursevideos);
router.get('/total-teammembers', dashboardController.getTotalTeammembers);
router.get('/total-admins', dashboardController.getTotalAdmins);

module.exports = router;
