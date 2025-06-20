// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
