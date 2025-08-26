const express = require('express');
const router = express.Router();
const { getPendingRequests, updateRequestStatus, getWardenProfile, updateWardenProfile } = require('../controllers/wardenController');
const { protect, wardenOnly } = require('../middleware/auth');


router.get('/requests', protect, wardenOnly, getPendingRequests);
router.put('/requests/:id/status', protect, wardenOnly, updateRequestStatus);

// Profile routes
router.get('/profile', protect, wardenOnly, getWardenProfile);
router.put('/profile', protect, wardenOnly, updateWardenProfile);

module.exports = router;