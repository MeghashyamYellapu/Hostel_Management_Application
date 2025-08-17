const express = require('express');
const router = express.Router();
const { getPendingRequests, updateRequestStatus } = require('../controllers/hodController');
const { protect, hodOnly } = require('../middleware/auth');

router.get('/requests', protect, hodOnly, getPendingRequests);
router.put('/requests/:id/status', protect, hodOnly, updateRequestStatus);

module.exports = router;