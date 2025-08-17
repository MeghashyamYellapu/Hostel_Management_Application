const express = require('express');
const router = express.Router();
const GatePass = require('../models/GatePass');
const { protect } = require('../middleware/auth');

// @desc    Get a gate pass by ID for a specific student
// @route   GET /api/student/gate-pass/:id
// @access  Private (student only)
router.get('/:id', protect, async (req, res) => {
    try {
        const gatePass = await GatePass.findById(req.params.id)
            .populate('student', 'fullName pin branch year photo')
            .populate({
                path: 'leaveRequest',
                populate: [{
                    path: 'hodApproval.approvedBy',
                    model: 'User',
                    select: 'fullName'
                }, {
                    path: 'wardenApproval.approvedBy',
                    model: 'User',
                    select: 'fullName'
                }, {
                    path: 'securityApproval.approvedBy',
                    model: 'User',
                    select: 'fullName'
                }]
            })
            .populate('securityOfficer.exit', 'fullName');

        if (!gatePass || gatePass.student._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ message: 'Gate pass not found or you are not authorized.' });
        }
        
        res.status(200).json(gatePass);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;