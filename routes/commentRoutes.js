const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// GET all comments for a video
router.get('/:videoId', commentController.getComments);

// POST a new comment for a video
router.post('/:videoId', commentController.addComment);

module.exports = router;
