// FILE: routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/teamController');
const upload = require('../middleware/upload');

// ✅ Get all team members
router.get('/', controller.getAllTeam);

// ✅ Add new member with optional photo
router.post('/', upload.single('photo'), controller.addTeamMember);

// ✅ Update team member with optional new photo
router.put('/:id', upload.single('photo'), controller.updateTeamMember);

// ✅ Delete team member
router.delete('/:id', controller.deleteTeamMember);

// ✅ (Optional) Separate photo upload endpoint (if used independently)
router.post('/upload', upload.single('photo'), controller.uploadPhoto);

module.exports = router;
