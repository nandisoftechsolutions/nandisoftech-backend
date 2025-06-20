const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { createUser, findUserByEmail } = require('../models/userModel');
require('dotenv').config();
const pool = require('../config/db');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Register with image support
const register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Profile picture path (if uploaded)
    const profilePicture = req.file ? req.file.path : null;

    // Save to database
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, profile_picture, role, created_at)
       VALUES ($1, $2, $3, $4, $5, now())
       RETURNING id, name, email, role, profile_picture`,
      [name, email, hashedPassword, profilePicture, 'client']
    );

    const newUser = result.rows[0];

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Nandi Softech!',
      text: `Hello ${name},\n\nThank you for registering with us!\n\n- Nandi Softech Solutions`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('Email send error:', err);
      else console.log('Registration email sent:', info.response);
    });

    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile_picture: newUser.profile_picture,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Login logic
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture || '/default-user.png',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Send OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query('UPDATE users SET otp = $1, otp_expiry = $2 WHERE id = $3', [otp, expiry, user.id]);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP for Password Reset - Nandi Softech',
      text: `Hello ${user.name},\n\nYour OTP is: ${otp}\n\nIt is valid for 10 minutes.\n\n- Nandi Softech`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('OTP email error:', err);
        return res.status(500).json({ message: 'Failed to send OTP' });
      }
      console.log('OTP sent:', info.response);
      res.json({ message: 'OTP sent to your email' });
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Verify OTP and reset password
const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1, otp = NULL, otp_expiry = NULL WHERE id = $2',
      [hashed, user.id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  sendOtp,
  verifyOtpAndResetPassword,
};
