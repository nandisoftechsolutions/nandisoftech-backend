const express = require('express');
const router = express.Router();
const pool = require('../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.put('/:id/status', async (req, res) => {
  const applicationId = req.params.id;
  const { status } = req.body;

  try {
    // Update status
    await pool.query('UPDATE job_applications SET status = $1 WHERE id = $2', [status, applicationId]);

    // Send email if shortlisted
    if (status.toLowerCase() === 'shortlisted') {
      const result = await pool.query(
        'SELECT applicant_name, applicant_email FROM job_applications WHERE id = $1',
        [applicationId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Applicant not found' });
      }

      const { applicant_name, applicant_email } = result.rows[0];

      // Setup transporter using .env
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Compose email
      const mailOptions = {
        from: `"Nandi Softech" <${process.env.EMAIL_FROM}>`,
        to: applicant_email,
        subject: '🎉 Congratulations! You have been Shortlisted!',
        html: `
          <p>Dear <strong>${applicant_name}</strong>,</p>
          <p>We are excited to inform you that you have been <strong>shortlisted</strong> for a position at <b>Nandi Softech Solutions</b>.</p>
          <p>Our team will contact you soon regarding the next steps in the hiring process.</p>
          <br/>
          <p>Warm regards,<br/>Nandi Softech Team</p>
        `,
      };

      // Send email
      await transporter.sendMail(mailOptions);
    }

    res.json({ message: 'Status updated and email sent if shortlisted.' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
