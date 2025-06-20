// backend/routes/projectRoutes.js
const express = require('express');
const { getAllProjects, getProjectById, addProject } = require('../controllers/projectController');

const router = express.Router();

// Route to get all projects
router.get('/projects', getAllProjects);

// Route to get a specific project by ID
router.get('/projects/:id', getProjectById);

// Route to add a new project
router.post('/projects', addProject);

module.exports = router;
