// File: controllers/userdetailsController.js
const pool = require('../config/db');

exports.getUserDetails = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, profile_picture } = req.body;
  try {
    await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3, profile_picture = $4 WHERE id = $5',
      [name, email, role, profile_picture, id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  const { email } = req.params;
  try {
    const orders = await pool.query('SELECT * FROM orders WHERE email = $1', [email]);
    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    name, phone, service_type, platform, features, design_style,
    deadline, budget, additional_notes, status, project_name
  } = req.body;
  try {
    await pool.query(
      `UPDATE orders SET name=$1, phone=$2, service_type=$3, platform=$4, features=$5,
       design_style=$6, deadline=$7, budget=$8, additional_notes=$9, status=$10, project_name=$11
       WHERE id = $12`,
      [name, phone, service_type, platform, features, design_style,
        deadline, budget, additional_notes, status, project_name, id]
    );
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query(`
      SELECT s.*, c.title AS course_name
      FROM subscriptions s
      JOIN courses c ON s.course_id = c.id
      WHERE s.user_email = $1
    `, [email]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitFeedback = async (req, res) => {
  const { name, email, description, rating } = req.body;
  try {
    await pool.query(
      'INSERT INTO feedback (name, email, description, rating, submitted_at) VALUES ($1, $2, $3, $4, NOW())',
      [name, email, description, rating]
    );
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};