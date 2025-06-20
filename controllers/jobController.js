// FILE: controllers/jobController.js
const pool = require('../config/db');
const sendEmail = require('../utils/mailer');
const fs = require('fs');
const path = require('path');

const getAllJobs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE status = $1 ORDER BY id DESC', ['Open']);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
};

const addJob = async (req, res) => {
  const { title, description, location, salary_range, exp_level, job_type, interview_type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO jobs (title, description, location, salary_range, exp_level, job_type, interview_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, location, salary_range, exp_level, job_type, interview_type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add job.' });
  }
};

const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const { title, description, location, salary_range, exp_level, job_type, interview_type } = req.body;
  try {
    await pool.query(
      'UPDATE jobs SET title=$1, description=$2, location=$3, salary_range=$4, exp_level=$5, job_type=$6, interview_type=$7 WHERE id=$8',
      [title, description, location, salary_range, exp_level, job_type, interview_type, jobId]
    );
    res.json({ message: 'Job updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job.' });
  }
};

const deleteJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    await pool.query('DELETE FROM jobs WHERE id = $1', [jobId]);
    res.json({ message: 'Job deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job.' });
  }
};

const getJobApplications = async (req, res) => {
  const { jobId } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, applicant_name, applicant_email, applicant_phone, resume_url, status, applied_at FROM applications WHERE job_id = $1 ORDER BY applied_at DESC',
      [jobId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
};

const getJobApplicationsCount = async (req, res) => {
  const { jobId } = req.params;
  try {
    const result = await pool.query('SELECT COUNT(*) FROM applications WHERE job_id = $1', [jobId]);
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch application count.' });
  }
};

const updateJobStatus = async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE jobs SET status = $1 WHERE id = $2', [status, jobId]);
    res.json({ message: 'Job status updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job status.' });
  }
};

const downloadResume = async (req, res) => {
  const { resumeName } = req.params;
  const resumePath = path.join(__dirname, '..', 'uploads', resumeName);
  if (fs.existsSync(resumePath)) {
    res.download(resumePath);
  } else {
    res.status(404).json({ error: 'Resume not found.' });
  }
};

module.exports = {
  getAllJobs,
  addJob,
  updateJob,
  deleteJob,
  getJobApplications,
  getJobApplicationsCount,
  updateJobStatus,
  downloadResume,
};
