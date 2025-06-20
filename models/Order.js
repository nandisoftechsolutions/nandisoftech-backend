const pool = require('../config/db');

// Initialize the table (you can use migrations or run once)
const createOrderTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      service_type VARCHAR(100),
      platform TEXT[],
      features TEXT[],
      design_style VARCHAR(100),
      deadline VARCHAR(50),
      budget VARCHAR(50),
      attachment VARCHAR(255),
      additional_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

createOrderTable();
module.exports = pool;