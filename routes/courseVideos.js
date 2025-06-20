const express = require('express');
const router = express.Router();
const controller = require('../controllers/courseVideosController');

router.get('/bycourse/:courseId', controller.getVideosByCourse);

module.exports = router;
