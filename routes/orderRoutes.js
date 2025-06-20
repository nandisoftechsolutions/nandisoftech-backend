const express = require('express');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  approveOrder
} = require('../controllers/orderController'); // assuming controller file

const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.put('/approve/:id', approveOrder);

module.exports = router;
