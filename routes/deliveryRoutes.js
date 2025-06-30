const express = require('express');
const { createDelivery, markAsPaid } = require('../controllers/deliveryController');
const router = express.Router();

router.post('/', createDelivery);
router.put('/pay/:id', markAsPaid);

module.exports = router;
