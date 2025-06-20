// File: routes/managevideoRoutes.js
const express = require('express');
const router = express.Router();
const managevideoController = require('../controllers/managevideoController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const multiUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videos', maxCount: 1 }
]);

// Video Routes
router.get('/', managevideoController.getVideos);
router.get('/:id', managevideoController.getVideoById);
router.get('/bycourse/:courseId', managevideoController.getVideosByCourse);
router.post('/', multiUpload, managevideoController.createVideo);
router.put('/:id', multiUpload, managevideoController.updateVideo);
router.delete('/:id', managevideoController.deleteVideo);

module.exports = router;
