// ✅ File: routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // ✅ You must import multer
const authController = require('../controllers/authController');

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: './uploads/', // ✅ Make sure this folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Register route with profile image upload
router.post('/register', upload.single('profilePicture'), authController.register);

// ✅ Login and password features
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtpAndResetPassword);

module.exports = router;
