// backend/routes/blogsRoutes.js

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Define routes
router.get('/', blogController.getBlogs);                      // Get all blogs
router.get('/:id', blogController.getBlogById);                // Get single blog by ID
router.post('/', upload.single('thumbnail'), blogController.createBlog);   // Add blog
router.put('/:id', upload.single('thumbnail'), blogController.updateBlog); // Update blog
router.delete('/:id', blogController.deleteBlog);              // Delete blog

module.exports = router;
