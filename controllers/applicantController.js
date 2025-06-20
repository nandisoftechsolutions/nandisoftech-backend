// FILE: controllers/applicantController.js
const pool = require('../config/db');
const sendEmail = require('../utils/mailer');

const updateApplicantStatus = async (req, res) => {
  const { applicantId } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2',
      [status, applicantId]
    );

    if (status === 'Shortlisted') {
      const result = await pool.query(
        'SELECT applicant_email FROM applications WHERE id = $1',
        [applicantId]
      );
      const applicantEmail = result.rows[0]?.applicant_email;
      if (applicantEmail) {
        const subject = 'Congratulations! You have been shortlisted.';
        const text = 'Dear Applicant,\n\nYou have been shortlisted for the job.\n\nBest regards,\nNandi Softech';
        const html = '<p>Dear Applicant,</p><p>You have been shortlisted for the job.</p><p>Best regards,<br>Nandi Softech</p>';

        await sendEmail(applicantEmail, subject, text, html);
      }
    }

    res.json({ message: 'Applicant status updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update applicant status.' });
  }
};

module.exports = { updateApplicantStatus };