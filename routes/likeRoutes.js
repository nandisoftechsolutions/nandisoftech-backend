const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Route to get total likes/dislikes for a video
// GET /api/likes/:videoId
router.get('/:videoId', likeController.getLikes);

// Route to add or update a like/dislike
// POST /api/likes/:videoId
router.post('/:videoId', likeController.addLike);

module.exports = router;
