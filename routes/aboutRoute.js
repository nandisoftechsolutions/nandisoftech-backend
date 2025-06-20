// backend/routes/aboutRoute.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// backend/routes/aboutRoute.js
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, role, bio, photo_url
      FROM teammembers
      ORDER BY is_founder DESC, is_cofounder DESC, created_at ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching team members:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
