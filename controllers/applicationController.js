// FILE: controllers/applicationController.js
const pool = require('../config/db');

const submitApplication = async (req, res) => {
  const { name, email, phone, jobId } = req.body;
  const resumePath = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await pool.query(
      'INSERT INTO applications (job_id, applicant_name, applicant_email, applicant_phone, resume_url) VALUES ($1, $2, $3, $4, $5)',
      [jobId, name, email, phone, resumePath]
    );
    res.json({ message: 'Application submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
};

module.exports = { submitApplication };