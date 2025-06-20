// FILE: routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { submitApplication } = require('../controllers/applicationController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/apply', upload.single('resume'), submitApplication);

module.exports = router;