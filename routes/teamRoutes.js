const express = require('express');
const router = express.Router();
const controller = require('../controllers/teamController');
const upload = require('../middleware/upload');

router.get('/', controller.getAllTeam);
router.post('/', controller.addTeamMember);
router.put('/:id', controller.updateTeamMember);
router.delete('/:id', controller.deleteTeamMember);
router.post('/upload', upload.single('photo'), controller.uploadPhoto);

module.exports = router;
