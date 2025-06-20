const pool = require('../config/db');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/mailer');

async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    let query = '';
    let values = [];

    if (password && password.trim() !== '') {
      const hashed = await bcrypt.hash(password, 10);
      query = `
        UPDATE users
        SET name = $1, email = $2, password_hash = $3, role = $4
        WHERE id = $5
      `;
      values = [name, email, hashed, role, id];

      // ✅ Send email with new password
      await sendEmail(
        email,
        'Password Updated - Nandi Softech',
        `Hi ${name},\n\nYour password has been updated. Your new password is: ${password}\n\nRegards,\nNandi Softech Solutions`
      );

    } else {
      query = `
        UPDATE users
        SET name = $1, email = $2, role = $3
        WHERE id = $4
      `;
      values = [name, email, role, id];
    }

    await pool.query(query, values);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteUser(req, res) {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllUsers, updateUser, deleteUser };
