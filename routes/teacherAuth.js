// File: routes/teacherAuth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Teacher Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM teachers WHERE email = $1', [email]);
    const teacher = result.rows[0];

    if (!teacher) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, teacher.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const payload = { id: teacher.id, email: teacher.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        profile_picture: teacher.profile_picture,
        bio: teacher.bio,
      },
    });
  } catch (err) {
    console.error('Teacher login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
