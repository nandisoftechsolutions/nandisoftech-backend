// File: routes/managevideoRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const managevideoController = require('../controllers/managevideoController');

// ✅ Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage configuration for unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ Configure upload for both video and thumbnail fields
const multiUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videos', maxCount: 1 }
]);

// -----------------------------------------
// ✅ MANAGE VIDEO ROUTES
// -----------------------------------------

// ✅ GET: All videos with course and teacher info
router.get('/', managevideoController.getVideos);

// ✅ GET: Videos by course ID (specific must come before /:id)
router.get('/bycourse/:courseId', managevideoController.getVideosByCourse);

// ✅ GET: Single video by ID
router.get('/:id', managevideoController.getVideoById);

// ✅ POST: Create a new video with file uploads
router.post('/', multiUpload, managevideoController.createVideo);

// ✅ PUT: Update an existing video with optional new files
router.put('/:id', multiUpload, managevideoController.updateVideo);

// ✅ DELETE: Delete video by ID
router.delete('/:id', managevideoController.deleteVideo);

module.exports = router;
