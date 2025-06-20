const pool = require('../config/db');

exports.getAllTeachers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teachers ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching teachers:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const profile_picture = req.file?.filename || null;

    const result = await pool.query(
      'INSERT INTO teachers (name, email, bio, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, bio, profile_picture]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating teacher:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const { id } = req.params;
    const profile_picture = req.file?.filename;

    let currentPic = null;
    if (!profile_picture) {
      const res1 = await pool.query('SELECT profile_picture FROM teachers WHERE id=$1', [id]);
      currentPic = res1.rows[0]?.profile_picture;
    }

    const result = await pool.query(
      `UPDATE teachers SET name=$1, email=$2, bio=$3, profile_picture=$4 WHERE id=$5 RETURNING *`,
      [name, email, bio, profile_picture || currentPic, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating teacher:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    await pool.query('DELETE FROM teachers WHERE id=$1', [req.params.id]);
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    console.error('Error deleting teacher:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
