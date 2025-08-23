const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;