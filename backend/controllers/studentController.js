const LeaveRequest = require('../models/LeaveRequest');
const GatePass = require('../models/GatePass'); // Add this import
const User = require('../models/User');
const qrcode = require('qrcode');
const { encrypt } = require('../utils/encryption');

const generateRequestId = async () => {
    const count = await LeaveRequest.countDocuments();
    return `LR-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
};

const generatePassId = async () => {
    const count = await GatePass.countDocuments();
    return `GP-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
};

// @desc    Create a new leave request
// @route   POST /api/student/requests
// @access  Private (student only)
exports.createLeaveRequest = async (req, res) => {
    try {
        const { leaveType, reason, startDate, endDate, startTime, endTime, emergencyContact, additionalComments } = req.body;
        const studentId = req.user.id;
        const newRequest = new LeaveRequest({
            requestId: await generateRequestId(),
            student: studentId,
            leaveType,
            reason,
            startDate,
            endDate,
            startTime,
            endTime,
            emergencyContact,
            additionalComments,
            status: 'pending',
            currentStage: leaveType === 'emergency' ? 'warden' : 'hod'
        });
        await newRequest.save();
        res.status(201).json({ message: 'Leave request submitted successfully', request: newRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all leave requests for the logged-in student
// @route   GET /api/student/requests
// @access  Private (student only)
exports.getStudentLeaveRequests = async (req, res) => {
    try {
        const studentId = req.user.id;
        const requests = await LeaveRequest.find({ student: studentId }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single leave request by ID
// @route   GET /api/student/requests/:id
// @access  Private (student only)
exports.getSingleLeaveRequest = async (req, res) => {
    try {
        const request = await LeaveRequest.findById(req.params.id).populate('student', 'fullName pin branch year photo');
        if (!request || request.student.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(request);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Generate a gate pass for a student's approved request
// @route   POST /api/student/generate-pass/:id
// @access  Private (student only)
exports.generateGatePass = async (req, res) => {
    try {
        const requestId = req.params.id;
        const studentId = req.user.id;
        const leaveRequest = await LeaveRequest.findById(requestId).populate('student');
        if (!leaveRequest || leaveRequest.student._id.toString() !== studentId.toString()) {
            return res.status(403).json({ message: 'Not authorized to generate a pass for this request' });
        }
        if (leaveRequest.status !== 'warden_approved') {
            return res.status(400).json({ message: 'Request is not yet approved by the warden.' });
        }
        const existingPass = await GatePass.findOne({ leaveRequest: requestId });
        if (existingPass) {
            return res.status(200).json({ message: 'Gate pass already generated.', gatePass: existingPass });
        }
        const passId = await generatePassId();
        const qrData = JSON.stringify({
            passId: passId,
            studentId: leaveRequest.student._id,
            validUntil: leaveRequest.endDate
        });
        const encryptedData = encrypt(qrData);
        const qrCode = await qrcode.toDataURL(encryptedData);
        const newGatePass = new GatePass({
            passId: passId,
            leaveRequest: leaveRequest._id,
            student: leaveRequest.student._id,
            validFrom: new Date(leaveRequest.startDate),
            validUntil: new Date(leaveRequest.endDate),
            qrCode: qrCode,
            encryptedData: encryptedData,
        });
        await newGatePass.save();
        leaveRequest.status = 'gate_pass_generated';
        leaveRequest.currentStage = 'completed';
        await leaveRequest.save();
        res.status(201).json({ message: 'Gate pass generated successfully', gatePass: newGatePass });
    } catch (err) {
        console.error("Error in generateGatePass:", err);
        res.status(500).json({ message: 'Server error', details: err.message });
    }
};