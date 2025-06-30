const express = require('express');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  approveOrder,
  deliverOrder // ✅ Newly added for delivery feature
} = require('../controllers/orderController');

const router = express.Router();

// ✅ Order CRUD routes
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.put('/approve/:id', approveOrder);

// ✅ Delivery submission route
router.post('/deliveries', deliverOrder);

module.exports = router;
