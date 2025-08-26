const express = require('express');
const router = express.Router();
const { getPendingRequests, updateRequestStatus, getHodProfile, updateHodProfile } = require('../controllers/hodController');
const { protect, hodOnly } = require('../middleware/auth');


router.get('/requests', protect, hodOnly, getPendingRequests);
router.put('/requests/:id/status', protect, hodOnly, updateRequestStatus);

// Profile routes
router.get('/profile', protect, hodOnly, getHodProfile);
router.put('/profile', protect, hodOnly, updateHodProfile);

module.exports = router;