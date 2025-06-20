const pool = require('../config/db');

exports.getAllProjects = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProject = async (req, res) => {
  const { title, description, service_type, youtube_link, demo_link } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : '';

  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO projects (title, description, service_type, image_url, youtube_link, demo_link)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, service_type, image_url, youtube_link, demo_link]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, service_type, youtube_link, demo_link } = req.body;
  const image_url = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.current_image_url;

  try {
    const { rows } = await pool.query(
      `UPDATE projects SET title=$1, description=$2, service_type=$3, image_url=$4,
         youtube_link=$5, demo_link=$6, updated_at=CURRENT_TIMESTAMP
       WHERE id=$7 RETURNING *`,
      [title, description, service_type, image_url, youtube_link, demo_link, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
