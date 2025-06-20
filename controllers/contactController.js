// backend/controllers/contactController.js
const pool = require('../config/db');
const sendEmail = require('../utils/emailer');

const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('📩 Received:', req.body);

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)`,
      [name, email, subject, message]
    );

    await sendEmail(
      email,
      'Thanks for contacting Nandi Softech',
      `Hi ${name},\n\nWe received your message and will get back soon.`,
      `<p>Hi <strong>${name}</strong>,<br/>Thanks for reaching out! We’ll follow up shortly.</p>`
    );

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { submitContactForm };
