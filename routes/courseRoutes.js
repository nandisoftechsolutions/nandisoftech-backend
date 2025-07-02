const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// ✅ Specific routes
router.get('/', courseController.getAllCourses);
router.get('/byid/:id', courseController.getCourseById);
router.post('/add', courseController.addCourse);
router.put('/update/:id', courseController.updateCourse);
router.delete('/delete/:id', courseController.deleteCourse);
router.post('/init-payment', courseController.initPayment);
router.post('/verify-payment', courseController.verifyPayment);
router.get('/courseId/is-enrolled', courseController.isEnrolled);

// ✅ LAST: dynamic slug route
router.get('/:slug', courseController.getCourseBySlug); // <-- must be last!

module.exports = router;
