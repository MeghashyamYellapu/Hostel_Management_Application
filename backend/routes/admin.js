const express = require('express');
const router = express.Router();
const { createStaffAccount, getAllUsers, updateUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth'); // Assuming you have adminOnly middleware

router.post('/staff', protect, adminOnly, createStaffAccount);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id', protect, adminOnly, updateUser);

module.exports = router;