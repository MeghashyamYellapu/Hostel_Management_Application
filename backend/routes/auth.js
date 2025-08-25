const express = require('express');
const { register, login, forgotPassword, resetPassword, getProfile, updateProfile, updatePassword } = require('../controllers/authController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile); // This is the missing GET route
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

module.exports = router;