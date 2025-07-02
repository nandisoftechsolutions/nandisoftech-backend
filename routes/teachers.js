// FILE: routes/teachers.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const teacherController = require('../controllers/teacherController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

// Optional: limit file types to images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isMime = allowedTypes.test(file.mimetype);
  const isExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isMime && isExt) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter
});

// Teacher Routes
router.get('/', teacherController.getAllTeachers);
router.post('/', upload.single('profile_picture'), teacherController.createTeacher);
router.put('/:id', upload.single('profile_picture'), teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
