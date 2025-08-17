const express = require('express');
const router = express.Router();
const { getPendingRequests, updateRequestStatus } = require('../controllers/wardenController');
const { protect, wardenOnly } = require('../middleware/auth');

router.get('/requests', protect, wardenOnly, getPendingRequests);
router.put('/requests/:id/status', protect, wardenOnly, updateRequestStatus);

module.exports = router;