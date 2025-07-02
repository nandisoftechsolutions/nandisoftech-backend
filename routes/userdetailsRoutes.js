// FILE: routes/userdetailsRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUserDetails,
  updateUser,
  getUserOrders,
  updateOrder,
  getUserSubscriptions,
  submitFeedback,
} = require('../controllers/userdetailsController');

// More explicit paths avoiding problematic param names:
router.put('/orders/:id', updateOrder);
router.post('/feedback', submitFeedback);

router.get('/user/:email/orders', getUserOrders);
router.get('/user/:email/subscriptions', getUserSubscriptions);

router.get('/user/:email', getUserDetails);
router.put('/:id', updateUser);

module.exports = router;
