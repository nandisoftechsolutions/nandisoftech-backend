const pool = require('../config/db');
const path = require('path');
const sendEmail = require('../utils/mailer');

// 📌 Get All Admins
exports.getAdmins = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, photo_url FROM admins ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Add Admin with Email Notification
exports.addAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const photo_url = req.file ? `/uploads/admins/${req.file.filename}` : null;

    const existing = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    const result = await pool.query(
      'INSERT INTO admins (name, email, password, role, photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, password, role, photo_url]
    );

    const newAdmin = result.rows[0];

    // ✅ Send Email Notification
    const subject = 'You are now an Admin at Nandi Softech Solutions!';
    const html = `
      <p>Dear ${newAdmin.name},</p>
      <p>Welcome to <strong>Nandi Softech Solutions</strong>! 🎉</p>
      <p>You have been added as an <strong>Admin</strong> and now have access to the admin panel.</p>

      <h4>Your Login Details:</h4>
      <ul>
        <li><strong>Email:</strong> ${newAdmin.email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>

      <p>Please keep this information secure and do not share it with others.</p>
      <br />
      <p>Regards,</p>
      <p><strong>Arjun Nandi</strong><br />Founder, Nandi Softech Solutions</p>
    `;

    await sendEmail(newAdmin.email, subject, '', html);

    res.status(201).json({
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      photo_url: newAdmin.photo_url,
    });
  } catch (err) {
    console.error("Admin creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📌 Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, photo_url: existingPhotoUrl } = req.body;
    const newPhotoUrl = req.file ? `/uploads/admins/${req.file.filename}` : existingPhotoUrl;

    const result = await pool.query(
      'UPDATE admins SET name=$1, email=$2, password=$3, role=$4, photo_url=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
      [name, email, password, role, newPhotoUrl, id]
    );

    const updatedAdmin = result.rows[0];
    res.json({
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      photo_url: updatedAdmin.photo_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM admins WHERE id=$1', [id]);
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = result.rows[0];

   if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      photo: admin.photo_url, // ✅ frontend expects this key
      message: 'Login successful',
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Server error during login' });
  }
};
