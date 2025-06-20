// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// ✅ Use DATABASE_URL directly (recommended for Render deployment)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL SSL
  },
});

// Optional: Test DB connection on startup
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL via DATABASE_URL!'))
  .catch((err) => console.error('❌ DB connection error:', err));

module.exports = pool;
