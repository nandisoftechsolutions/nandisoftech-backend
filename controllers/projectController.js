// backend/controllers/projectController.js
const pool = require('../config/db');

// Function to get all projects
const getAllProjects = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to get a single project by ID
const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to add a new project
const addProject = async (req, res) => {
  const { title, description, service_type, image_url, youtube_link, demo_link } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO projects (title, description, service_type, image_url, youtube_link, demo_link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, service_type, image_url, youtube_link, demo_link]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new project:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  addProject
};
