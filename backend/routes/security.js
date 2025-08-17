const express = require('express');
const router = express.Router();
const { getApprovedRequests, generateGatePass, scanGatePass } = require('../controllers/securityController');
const { protect, securityOnly } = require('../middleware/auth');

router.get('/requests', protect, securityOnly, getApprovedRequests);
router.post('/requests/:id/generate', protect, securityOnly, generateGatePass);
router.post('/scan', protect, securityOnly, scanGatePass);

module.exports = router;