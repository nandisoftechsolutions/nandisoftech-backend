const pool = require('../config/db');

// ✅ Add new comment
exports.addComment = async (req, res) => {
  const { user_id, user_name, user_avatar, comment_text } = req.body;
  const { videoId } = req.params;

  if (!comment_text || !user_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO video_comments (video_id, user_id, user_name, user_avatar, comment_text)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [videoId, user_id, user_name, user_avatar, comment_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addComment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get comments for a video
exports.getComments = async (req, res) => {
  const { videoId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, user_name, user_avatar, comment_text, created_at
       FROM video_comments
       WHERE video_id = $1
       ORDER BY created_at DESC`,
      [videoId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getComments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
