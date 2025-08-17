const express = require('express');
const { register, login } = require('../controllers/authController');
const upload = require('../middleware/upload'); // Correctly import the middleware
const router = express.Router();

// The upload middleware must be placed here, before the controller
// 'photo' in upload.single('photo') must match the name attribute of your file input
router.post('/register', upload.single('photo'), register);

router.post('/login', login);

module.exports = router;