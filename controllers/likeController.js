const pool = require('../config/db');

// ✅ Get total likes/dislikes for a video, including what the current user did
exports.getLikes = async (req, res) => {
  const videoId = req.params.videoId;
  const userName = req.query.user;

  try {
    // Total likes and dislikes
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE is_like = true) AS likes,
        COUNT(*) FILTER (WHERE is_like = false) AS dislikes
      FROM video_likes
      WHERE video_id = $1
    `, [videoId]);

    // Check if this user has already reacted
    let userLiked = null;
    if (userName) {
      const userResult = await pool.query(`
        SELECT is_like FROM video_likes
        WHERE video_id = $1 AND user_name = $2
        LIMIT 1
      `, [videoId, userName]);

      if (userResult.rows.length > 0) {
        userLiked = userResult.rows[0].is_like ? 'like' : 'dislike';
      }
    }

    res.json({
      ...result.rows[0],
      userLiked,
    });
  } catch (err) {
    console.error('getLikes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Like / Dislike a video (UPSERT)
exports.addLike = async (req, res) => {
  const { user_name, is_like = true } = req.body;
  const { videoId } = req.params;

  try {
    const result = await pool.query(
      `INSERT INTO video_likes (video_id, user_name, is_like)
       VALUES ($1, $2, $3)
       ON CONFLICT (video_id, user_name)
       DO UPDATE SET is_like = EXCLUDED.is_like
       RETURNING *`,
      [videoId, user_name, is_like]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addLike error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
