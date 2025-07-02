// File: server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://nandisofetchsolution.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(uploadDir));

// Route definitions: [mount path, relative route file path]
const routeFiles = [
  ['/api/orders', './routes/orderRoutes'],
  ['/api/auth', './routes/authRoutes'],
  ['/api/projects', './routes/projectRoutes'],
  ['/api/videos', './routes/videoRoutes'],
  ['/api/jobs', './routes/jobRoutes'],
  ['/api/applications', './routes/applicationRoutes'],
  ['/api/applicants', './routes/applicantRoutes'],
  ['/api/manageprojects', './routes/projectmanageRoutes'],
  ['/api/managevideo', './routes/managevideoRoutes'],
  ['/api/manageblogs', './routes/blogsRoutes'],
  ['/api/team', './routes/teamRoutes'],
  ['/api/messages', './routes/messageRoutes'],
  ['/api/contact', './routes/contactRoutes'],
  ['/api/users', './routes/userRoutes'],
  ['/api/admins', './routes/adminRoutes'],
  ['/api/teammembers', './routes/aboutRoute'],
  ['/api/dashboard', './routes/dashboardRoutes'],
  ['/api/teacher', './routes/teacherAuth'],
  ['/api/teachers', './routes/teachers'],
  ['/api/coursevideos', './routes/courseVideos'],
  ['/api/courses', './routes/courseRoutes'],
  ['/api/comments', './routes/commentRoutes'],
  ['/api/likes', './routes/likeRoutes'],
  ['/api/deliveries', './routes/deliveryRoutes'],
  ['/api/user', './routes/userdetailsRoutes'],
];

// Mount all routes
for (const [mountPath, relativePath] of routeFiles) {
  try {
    const routePath = path.resolve(__dirname, relativePath);
    console.log(`Mounting route: ${mountPath} -> ${relativePath}`);
    const routeModule = require(routePath);
    app.use(mountPath, routeModule);
  } catch (error) {
    console.error(`❌ Failed to load route ${relativePath} for path ${mountPath}:`, error.message);
    process.exit(1);
  }
}

// Home route
app.get('/', (req, res) => {
  res.send('✅ Nandi Softech Backend API is running...');
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
