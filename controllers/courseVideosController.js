const pool = require('../config/db');

exports.getVideosByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const result = await pool.query(
      'SELECT * FROM coursevideos WHERE course_id = $1',
      [courseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getVideosByCourse error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
