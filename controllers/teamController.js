const pool = require('../config/db');

// Get all team members
exports.getAllTeam = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teammembers ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch team error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add new team member
exports.addTeamMember = async (req, res) => {
  try {
    const {
      name, role, bio, department, email,
      linkedin, is_founder, is_cofounder, photo_url
    } = req.body;

    await pool.query(
      `INSERT INTO teammembers (name, role, bio, department, email, linkedin, is_founder, is_cofounder, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [name, role, bio, department, email, linkedin, is_founder, is_cofounder, photo_url]
    );

    res.status(201).json({ message: 'Team member added successfully' });
  } catch (err) {
    console.error('Add team member error:', err);
    res.status(500).json({ error: 'Add failed' });
  }
};

// Update existing team member
exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, role, bio, department, email,
      linkedin, is_founder, is_cofounder, photo_url
    } = req.body;

    await pool.query(
      `UPDATE teammembers
       SET name=$1, role=$2, bio=$3, department=$4,
           email=$5, linkedin=$6, is_founder=$7, is_cofounder=$8, photo_url=$9
       WHERE id=$10`,
      [name, role, bio, department, email, linkedin, is_founder, is_cofounder, photo_url, id]
    );

    res.json({ message: 'Team member updated' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM teammembers WHERE id=$1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
};

// Upload photo
exports.uploadPhoto = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const photo_url = req.file.filename;
  res.json({ photo_url });
};
