// File: routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// ✅ GET: Fetch all courses
router.get('/', courseController.getAllCourses);

// ✅ GET: Fetch course details by slug (used in frontend via /courses/:slug)
router.get('/:slug', courseController.getCourseBySlug);

// ✅ POST: Add a new course
router.post('/add', courseController.addCourse);

// ✅ PUT: Update an existing course by ID
router.put('/update/:id', courseController.updateCourse);

// ✅ DELETE: Delete a course by ID
router.delete('/delete/:id', courseController.deleteCourse);

router.get('/byid/:id', courseController.getCourseById);

router.post('/init-payment', courseController.initPayment);
router.post('/verify-payment', courseController.verifyPayment);

router.get('/:courseId/is-enrolled', courseController.isEnrolled);

module.exports = router;
