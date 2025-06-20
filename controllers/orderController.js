// backend/controllers/orderController.js
const pool = require('../config/db');

// ✅ Get all orders
const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Failed to fetch orders');
  }
};

// ✅ Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).send('Order not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).send('Failed to fetch order');
  }
};

// ✅ Create new order
const createOrder = async (req, res) => {
  try {
    const {
      name, email, phone, service_type, platform,
      features, design_style, deadline, budget,
      attachment, additional_notes
    } = req.body;

    const result = await pool.query(`
      INSERT INTO orders (
        name, email, phone, service_type, platform,
        features, design_style, deadline, budget,
        attachment, additional_notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name, email, phone, service_type, platform,
        features, design_style, deadline, budget,
        attachment, additional_notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).send('Failed to create order');
  }
};

// ✅ Update order
const updateOrder = async (req, res) => {
  try {
    const {
      name, email, phone, service_type, platform,
      features, design_style, deadline, budget,
      attachment, additional_notes
    } = req.body;

    const result = await pool.query(`
      UPDATE orders SET
        name=$1, email=$2, phone=$3, service_type=$4, platform=$5,
        features=$6, design_style=$7, deadline=$8, budget=$9,
        attachment=$10, additional_notes=$11
      WHERE id=$12 RETURNING *`,
      [name, email, phone, service_type, platform,
        features, design_style, deadline, budget,
        attachment, additional_notes, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).send('Failed to update order');
  }
};

// ✅ Delete order
const deleteOrder = async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).send('Failed to delete order');
  }
};

// ✅ Approve order or assign team
const approveOrder = async (req, res) => {
  try {
    const { status, assigned_team } = req.body;

    const result = await pool.query(`
      UPDATE orders SET status = $1, assigned_team = $2 WHERE id = $3 RETURNING *`,
      [status, assigned_team, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error approving order:', err);
    res.status(500).send('Failed to approve order');
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  approveOrder
};
