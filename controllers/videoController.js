const pool = require('../config/db');

const getAllVideos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM videos ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const addVideo = async (req, res) => {
  const { title, description, thumbnail_url, youtube_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO videos (title, description, thumbnail_url, youtube_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, thumbnail_url, youtube_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllVideos, getVideoById, addVideo };
