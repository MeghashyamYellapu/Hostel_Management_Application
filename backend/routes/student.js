const express = require('express');
const router = express.Router();
const { createLeaveRequest, getStudentLeaveRequests, getSingleLeaveRequest, generateGatePass, deleteRequest } = require('../controllers/studentController');
const { protect, studentOnly } = require('../middleware/auth');

router.post('/requests', protect, studentOnly, createLeaveRequest);
router.get('/requests', protect, studentOnly, getStudentLeaveRequests);
router.get('/requests/:id', protect, studentOnly, getSingleLeaveRequest);
router.post('/generate-pass/:id', protect, studentOnly, generateGatePass);
router.delete('/requests/:id', protect, studentOnly, deleteRequest);

module.exports = router;