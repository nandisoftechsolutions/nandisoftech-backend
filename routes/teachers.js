const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const teacherController = require('../controllers/teacherController');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.get('/', teacherController.getAllTeachers);
router.post('/', upload.single('profile_picture'), teacherController.createTeacher);
router.put('/:id', upload.single('profile_picture'), teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
