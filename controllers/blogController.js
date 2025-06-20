// backend/controllers/blogController.js
const pool = require('../config/db'); // Make sure you have a db.js with PostgreSQL pool config
const fs = require('fs');
const path = require('path');

exports.getBlogs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category, video_link } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    await pool.query(
      'INSERT INTO blogs (title, content, category, video_link, thumbnail) VALUES ($1, $2, $3, $4, $5)',
      [title, content, category, video_link, thumbnail]
    );
    res.status(201).json({ message: 'Blog created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, video_link } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    if (thumbnail) {
      // delete old thumbnail
      const result = await pool.query('SELECT thumbnail FROM blogs WHERE id = $1', [id]);
      const oldThumb = result.rows[0]?.thumbnail;
      if (oldThumb) {
        const oldPath = path.join(__dirname, '../uploads', oldThumb);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await pool.query(
      `UPDATE blogs SET title=$1, content=$2, category=$3, video_link=$4, 
        thumbnail=COALESCE($5, thumbnail) WHERE id=$6`,
      [title, content, category, video_link, thumbnail, id]
    );
    res.json({ message: 'Blog updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT thumbnail FROM blogs WHERE id = $1', [id]);
    const thumbnail = result.rows[0]?.thumbnail;
    if (thumbnail) {
      const imagePath = path.join(__dirname, '../uploads', thumbnail);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
