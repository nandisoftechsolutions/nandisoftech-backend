// FILE: controllers/dashboardController.js
const pool = require('../config/db');

// 📊 Total Orders
exports.getTotalOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM orders');
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Open Jobs
exports.getOpenJobs = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM jobs WHERE status = 'Open'");
    res.json({ openJobs: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Total Applications
exports.getTotalApplications = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM applications');
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Total Projects
exports.getTotalProjects = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM projects');
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Total Messages
exports.getTotalMessages = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM contact_messages');
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Total Users
exports.getTotalUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Total Blogs
exports.getTotalBlogs = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM blogs');
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Total Admins
exports.getTotalAdmins = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM admins');
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Total CoursesVideos
exports.getTotalCoursevideos = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM coursevideos');
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Total Team Mmbers
exports.getTotalTeammembers = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM teammembers');
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
