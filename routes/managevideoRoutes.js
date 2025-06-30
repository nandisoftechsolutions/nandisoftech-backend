// File: routes/managevideoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const managevideoController = require('../controllers/managevideoController');

// ✅ Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure multer for file uploads with unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ Allow both video and thumbnail fields
const multiUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videos', maxCount: 1 }
]);

// -----------------------------------------
// ✅ MANAGE VIDEO ROUTES
// -----------------------------------------

// ✅ GET: All videos (with course and teacher info)
router.get('/', managevideoController.getVideos);

// ✅ GET: Single video by ID
router.get('/:id', managevideoController.getVideoById);

// ✅ GET: Videos by course ID
router.get('/bycourse/:courseId', managevideoController.getVideosByCourse);

// ✅ POST: Create new video (with thumbnail & video file)
router.post('/', multiUpload, managevideoController.createVideo);

// ✅ PUT: Update video by ID (supports new file upload)
router.put('/:id', multiUpload, managevideoController.updateVideo);

// ✅ DELETE: Delete video by ID
router.delete('/:id', managevideoController.deleteVideo);

module.exports = router;
