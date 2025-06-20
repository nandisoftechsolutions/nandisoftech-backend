const express = require('express');
const router = express.Router();
const { getAllVideos, getVideoById, addVideo } = require('../controllers/videoController');

router.get('/videos', getAllVideos);
router.get('/videos/:id', getVideoById);
router.post('/videos', addVideo);

module.exports = router;
