// folder: backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/', messageController.getMessages);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
