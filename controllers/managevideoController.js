const pool = require('../config/db');
const path = require('path');

// ✅ Get all videos with course and teacher info
exports.getVideos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.*, 
        c.title AS course,
        t.name AS teacher_name,
        t.profile_picture AS teacher_profile_picture
      FROM courseVideos v
      LEFT JOIN courses c ON v.course_id = c.id
      LEFT JOIN teachers t ON v.teacher_id = t.id
      ORDER BY v.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ getVideos error:', err.message);
    res.status(500).json({ error: 'Server error while fetching videos' });
  }
};

// ✅ Get videos by course ID (for related videos)
exports.getVideosByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query(
      `SELECT * FROM courseVideos WHERE course_id = $1 ORDER BY id DESC`,
      [courseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ getVideosByCourse error:', err.message);
    res.status(500).json({ error: 'Server error while fetching related videos' });
  }
};

// ✅ Get a single video by ID with course and teacher info
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        v.*, 
        c.title AS course,
        c.id AS course_id,
        c.thumbnail AS course_thumbnail,
        c.price AS course_price,
        c.description AS course_description,
        t.name AS teacher_name,
        t.profile_picture AS teacher_profile_picture
      FROM courseVideos v
      LEFT JOIN courses c ON v.course_id = c.id
      LEFT JOIN teachers t ON v.teacher_id = t.id
      WHERE v.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ getVideoById error:', err.message);
    res.status(500).json({ error: 'Server error while fetching video' });
  }
};

// ✅ Create a new video
exports.createVideo = async (req, res) => {
  try {
    const {
      title = '',
      description = '',
      uicode = '',
      backendcode = '',
      youtubeLink = '',
      course_id = null,
      teacher_id = null
    } = req.body;

    const thumbnail = req.files?.thumbnail?.[0]?.filename || null;
    const videos = req.files?.videos?.[0]?.filename || null;

    const result = await pool.query(
      `INSERT INTO courseVideos 
        (title, description, uicode, backendcode, youtubelink, thumbnail, videos, course_id, teacher_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title,
        description,
        uicode,
        backendcode,
        youtubeLink,
        thumbnail,
        videos,
        course_id ? parseInt(course_id) : null,
        teacher_id ? parseInt(teacher_id) : null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ createVideo error:', err.message);
    res.status(500).json({ error: 'Server error while creating video' });
  }
};

// ✅ Update an existing video
exports.updateVideo = async (req, res) => {
  try {
    const {
      title = '',
      description = '',
      uicode = '',
      backendcode = '',
      youtubeLink = '',
      course_id = null,
      teacher_id = null
    } = req.body;

    let thumbnail = req.files?.thumbnail?.[0]?.filename;
    let videos = req.files?.videos?.[0]?.filename;

    const existing = await pool.query(
      `SELECT thumbnail, videos FROM courseVideos WHERE id = $1`,
      [req.params.id]
    );

    if (!thumbnail) thumbnail = existing.rows[0]?.thumbnail || null;
    if (!videos) videos = existing.rows[0]?.videos || null;

    const result = await pool.query(
      `UPDATE courseVideos SET
         title = $1, 
         description = $2, 
         uicode = $3, 
         backendcode = $4,
         youtubelink = $5, 
         thumbnail = $6, 
         videos = $7,
         course_id = $8, 
         teacher_id = $9
       WHERE id = $10
       RETURNING *`,
      [
        title,
        description,
        uicode,
        backendcode,
        youtubeLink,
        thumbnail,
        videos,
        course_id ? parseInt(course_id) : null,
        teacher_id ? parseInt(teacher_id) : null,
        req.params.id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ updateVideo error:', err.message);
    res.status(500).json({ error: 'Server error while updating video' });
  }
};

// ✅ Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM courseVideos WHERE id = $1', [id]);

    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('❌ deleteVideo error:', err.message);
    res.status(500).json({ error: 'Server error while deleting video' });
  }
};
