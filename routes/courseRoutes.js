// File: routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const courseController = require('../controllers/courseController');

// ✅ Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// -----------------------------------------
// ✅ COURSE ROUTES
// -----------------------------------------

// GET all courses
router.get('/', courseController.getAllCourses);

// GET course by ID (admin or internal use)
router.get('/byid/:id', courseController.getCourseById);

// GET course enrollment check
router.get('/:courseId/is-enrolled', courseController.isEnrolled);

// POST add new course (with thumbnail upload)
router.post('/add', upload.single('thumbnail'), courseController.addCourse);

// PUT update course (with optional new thumbnail)
router.put('/update/:id', upload.single('thumbnail'), courseController.updateCourse);

// DELETE course by ID
router.delete('/delete/:id', courseController.deleteCourse);

// PAYMENT: Create Razorpay order
router.post('/init-payment', courseController.initPayment);

// PAYMENT: Verify Razorpay payment
router.post('/verify-payment', courseController.verifyPayment);

// GET course by slug (must come last to avoid conflict)
router.get('/:slug', courseController.getCourseBySlug);

module.exports = router;
