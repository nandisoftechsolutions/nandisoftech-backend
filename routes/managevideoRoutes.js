// File: routes/managevideoRoutes.js
const express = require('express');
const router = express.Router();
const managevideoController = require('../controllers/managevideoController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure multer storage for unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});

const upload = multer({ storage });

// ✅ Multer setup for thumbnail and video upload
const multiUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videos', maxCount: 1 }
]);

// ✅ Routes

// Get all videos with course and teacher info
router.get('/', managevideoController.getVideos);

// Get a single video by ID
router.get('/:id', managevideoController.getVideoById);

// Get videos by course ID
router.get('/bycourse/:courseId', managevideoController.getVideosByCourse);

// Create new video
router.post('/', multiUpload, managevideoController.createVideo);

// Update existing video
router.put('/:id', multiUpload, managevideoController.updateVideo);

// Delete video by ID
router.delete('/:id', managevideoController.deleteVideo);

module.exports = router;
