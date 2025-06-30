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
      name, project_name, email, phone, service_type, platform,
      features, design_style, deadline, budget,
      attachment, additional_notes, status,
      assigned_team, assign_to, start_date, end_date
    } = req.body;

    const result = await pool.query(`
      INSERT INTO orders (
        name, project_name, email, phone, service_type, platform,
        features, design_style, deadline, budget,
        attachment, additional_notes, status,
        assigned_team, assign_to, start_date, end_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *`,
      [name, project_name, email, phone, service_type, platform,
        features, design_style, deadline, budget,
        attachment, additional_notes, status,
        assigned_team, assign_to, start_date, end_date]
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
      name, project_name, email, phone, service_type, platform,
      features, design_style, deadline, budget,
      attachment, additional_notes, status,
      assigned_team, assign_to, start_date, end_date
    } = req.body;

    const result = await pool.query(`
      UPDATE orders SET
        name=$1, project_name=$2, email=$3, phone=$4, service_type=$5,
        platform=$6, features=$7, design_style=$8, deadline=$9, budget=$10,
        attachment=$11, additional_notes=$12, status=$13,
        assigned_team=$14, assign_to=$15, start_date=$16, end_date=$17
      WHERE id=$18 RETURNING *`,
      [name, project_name, email, phone, service_type, platform,
        features, design_style, deadline, budget,
        attachment, additional_notes, status,
        assigned_team, assign_to, start_date, end_date,
        req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).send('Order not found');
    }

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

    if (!result.rows.length) {
      return res.status(404).send('Order not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error approving order:', err);
    res.status(500).send('Failed to approve order');
  }
};

// ✅ Handle delivery (includes website link, final price, and admin credentials)
const deliverOrder = async (req, res) => {
  try {
    const { order_id, website_link, final_price, admin_id, admin_password } = req.body;

    await pool.query(`
      INSERT INTO deliveries (order_id, website_link, final_price, admin_id, admin_password)
      VALUES ($1, $2, $3, $4, $5)
    `, [order_id, website_link, final_price, admin_id, admin_password]);

    // Optional: send email logic here

    res.status(201).send('Delivery successful');
  } catch (err) {
    console.error('Error delivering order:', err);
    res.status(500).send('Failed to deliver order');
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  approveOrder,
  deliverOrder
};
