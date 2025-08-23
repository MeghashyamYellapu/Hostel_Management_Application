const LeaveRequest = require('../models/LeaveRequest');
const GatePass = require('../models/GatePass'); // Add this import
const User = require('../models/User');
const qrcode = require('qrcode');
const { encrypt } = require('../utils/encryption');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService');
// ...existing code...

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
        
        // Fetch the student's details
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        
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

        // --- Notification Logic ---
        const approverRole = newRequest.currentStage;
        let approvers = [];

        if (approverRole === 'hod') {
            approvers = await User.find({ role: 'hod', department: student.branch });
        } else if (approverRole === 'warden') {
            // Fetch the warden regardless of department for emergency leaves
            approvers = await User.find({ role: 'warden' });
        }

        if (approvers.length > 0) {
            const subject = `New Leave Request from ${student.fullName}`;
            const formattedMessage = `
                <h1>New Leave Request: ${subject}</h1>
                <p><strong>Student Name:</strong> ${student.fullName}</p>
                <p><strong>PIN Number:</strong> ${student.pin}</p>
                <p><strong>Branch:</strong> ${student.branch}</p>
                <p><strong>Leave Type:</strong> ${leaveType}</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p><strong>Duration:</strong> ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}</p>
                <p>Awaiting your approval. Please log in to the portal to review the request.</p>
            `;

            for (const approver of approvers) {
                // Send email notification
                await emailService.sendEmail(approver.email, subject, formattedMessage);
                // Send web notification (Socket.io)
                notificationService.sendNotification(
                    approver._id,
                    subject,
                    `A new leave request from ${student.fullName} is awaiting your approval.`,
                    'leave_submitted',
                    { leaveRequestId: newRequest._id }
                );
            }
        }
        // --- End Notification Logic ---

        res.status(201).json({ message: 'Leave request submitted successfully', request: newRequest });
    } catch (err) {
        console.error("Error submitting leave request:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all leave requests for the logged-in student
// @route   GET /api/student/requests
// @access  Private (student only)
exports.getStudentLeaveRequests = async (req, res) => {
    try {
        const studentId = req.user.id;
        // Add .populate() to fetch student details
        const requests = await LeaveRequest.find({ student: studentId })
            .populate('student', 'fullName branch year') // Correctly populates student fields
            .sort({ createdAt: -1 });
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

// GET /api/student/profile
exports.getStudentProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({
            name: user.fullName || user.name,
            email: user.email,
            phone: user.phone || '',
            branch: user.branch || '',
            year: user.year || ''
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// PUT /api/student/profile
exports.updateStudentProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ error: 'User not found' });
        const { name, email, phone, branch, year, password } = req.body;
        if (name) user.fullName = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (branch) user.branch = branch;
        if (year) user.year = year;
        if (password) user.password = password; // Should hash in real app
        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const studentId = req.user.id;
        const leaveRequest = await LeaveRequest.findById(requestId);

        if (!leaveRequest) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        if (leaveRequest.student.toString() !== studentId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this request.' });
        }

        // Only allow deletion of pending requests
        if (leaveRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending requests can be deleted.' });
        }

        await leaveRequest.deleteOne();
        res.status(200).json({ message: 'Request deleted successfully.', status: leaveRequest.status });
    } catch (err) {
        console.error('Error deleting request:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};