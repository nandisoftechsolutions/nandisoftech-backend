// backend/models/userModel.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Create a new user
const createUser = async (name, email, password) => {
  try {
    const password_hash = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`,
      [name, email, password_hash]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error in createUser:', err);
    throw err;
  }
};

// Find user by email
const findUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows.length ? result.rows[0] : null;
  } catch (err) {
    console.error('Error in findUserByEmail:', err);
    throw err;
  }
};

module.exports = { createUser, findUserByEmail };
