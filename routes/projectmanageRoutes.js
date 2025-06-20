const express = require('express');
const upload = require('../middleware/upload');
const controller = require('../controllers/projectmanageController');
const router = express.Router();

router.get('/', controller.getAllProjects);
router.post('/', upload.single('image_file'), controller.addProject);
router.put('/:id', upload.single('image_file'), controller.updateProject);
router.delete('/:id', controller.deleteProject);

module.exports = router;
