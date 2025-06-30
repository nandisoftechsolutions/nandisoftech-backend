// File: routes/userdetailsRoutes.js
const express = require('express');
const router = express.Router();
const { getUserDetails, updateUser, getUserOrders, updateOrder, getUserSubscriptions, submitFeedback } = require('../controllers/userdetailsController');

router.get('/:email', getUserDetails);
router.put('/:id', updateUser);
router.get('/:email/orders', getUserOrders);
router.put('/orders/:id', updateOrder);
router.get('/:email/subscriptions', getUserSubscriptions);
router.post('/feedback', submitFeedback);
module.exports = router;