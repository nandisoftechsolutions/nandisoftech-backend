// File: routes/videoRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllVideos,
  getVideoById,
  addVideo
} = require('../controllers/videoController');

// ✅ These resolve to:
// GET    /api/videos
// GET    /api/videos/:id
// POST   /api/videos
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.post('/', addVideo);

module.exports = router;
