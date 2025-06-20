// FILE: routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminController = require('../controllers/adminController');

// ✅ Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'admins');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Upload path is guaranteed to exist
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// ✅ File type validation (image only)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed (jpeg, png, gif)'));
  }
});

// ✅ Admin API Routes
router.get('/', adminController.getAdmins); // Get all admins
router.post('/', upload.single('photo'), adminController.addAdmin); // Add admin
router.put('/:id', upload.single('photo'), adminController.updateAdmin); // Update admin
router.delete('/:id', adminController.deleteAdmin); // Delete admin
router.post('/login', adminController.loginAdmin); // Admin login

module.exports = router;
