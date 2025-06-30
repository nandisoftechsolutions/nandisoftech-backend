const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ CORS Setup (Important: place before routes)
app.use(cors({
  origin: 'https://nandisofetchsolution.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Handle preflight requests globally
app.options('*', cors());

// ✅ Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadDir));

// ✅ Route Imports
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/applicants', require('./routes/applicantRoutes'));
app.use('/api/manageprojects', require('./routes/projectmanageRoutes'));
app.use('/api/managevideo', require('./routes/managevideoRoutes'));
app.use('/api/manageblogs', require('./routes/blogsRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/teammembers', require('./routes/aboutRoute'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/teacher', require('./routes/teacherAuth'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/coursevideos', require('./routes/courseVideos'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/likes', require('./routes/likeRoutes'));
app.use('/api/deliveries', require('./routes/deliveryRoutes'));
app.use('/api/user', require('./routes/userdetailsRoutes'));

// ✅ Default Home Route
app.get('/', (req, res) => {
  res.send('✅ Nandi Softech Backend API is running...');
});

// ❌ 404 Fallback Route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
