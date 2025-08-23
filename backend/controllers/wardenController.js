const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService');

exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await LeaveRequest.find({
            currentStage: 'warden',
            status: 'hod_approved'
        })
        .populate('student', 'fullName pin branch year photo');
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { status, comments } = req.body;
        const requestId = req.params.id;
        const wardenId = req.user.id;
        const leaveRequest = await LeaveRequest.findById(requestId).populate('student');

        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        
        if (leaveRequest.currentStage !== 'warden') {
            return res.status(403).json({ message: 'This request is not pending warden approval' });
        }

        leaveRequest.wardenApproval = {
            approvedBy: wardenId,
            status: status,
            comments: comments,
            timestamp: new Date()
        };
        leaveRequest.status = status === 'approved' ? 'warden_approved' : 'warden_rejected';
        leaveRequest.currentStage = status === 'approved' ? 'security' : 'completed';
        
        leaveRequest.statusHistory.push({
            status: leaveRequest.status,
            timestamp: new Date(),
            updatedBy: wardenId,
            comments: comments
        });

        await leaveRequest.save();

        // --- Notification Logic ---
        if (status === 'approved') {
            const student = leaveRequest.student;
            const subject = `Your Leave Request Has Been Approved!`;
            const formattedMessage = `
                <h1>Leave Request Approved by Warden</h1>
                <p>Hello ${student.fullName},</p>
                <p>Your leave request has been approved by the hostel warden.</p>
                <p><strong>Leave Type:</strong> ${leaveRequest.leaveType}</p>
                <p><strong>Reason:</strong> ${leaveRequest.reason}</p>
                <p><strong>Warden Comments:</strong> ${comments}</p>
                <p>You can now log in to your dashboard to generate your gate pass.</p>
            `;
            // Send email notification to the student
            await emailService.sendEmail(student.email, subject, formattedMessage);
            // Send web notification to the student
            notificationService.sendNotification(
                student._id,
                subject,
                `Your leave request has been approved by the warden and is ready for gate pass generation.`,
                'warden_approved',
                { leaveRequestId: leaveRequest._id }
            );
        } else if (status === 'rejected') {
             const student = leaveRequest.student;
            const subject = `Your Leave Request Has Been Rejected`;
            const formattedMessage = `
                <h1>Leave Request Rejected by Warden</h1>
                <p>Hello ${student.fullName},</p>
                <p>Your leave request has been rejected by the hostel warden.</p>
                <p><strong>Leave Type:</strong> ${leaveRequest.leaveType}</p>
                <p><strong>Reason:</strong> ${leaveRequest.reason}</p>
                <p><strong>Warden Comments:</strong> ${comments}</p>
            `;
             // Send email notification to the student
            await emailService.sendEmail(student.email, subject, formattedMessage);
            // Send web notification to the student
            notificationService.sendNotification(
                student._id,
                subject,
                `Your leave request has been rejected by the warden.`,
                'warden_rejected',
                { leaveRequestId: leaveRequest._id }
            );
        }
        // --- End Notification Logic ---

        res.status(200).json({ message: `Request ${status} successfully`, leaveRequest });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
// GET /api/warden/profile
exports.getWardenProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      name: user.fullName || user.name,
      email: user.email,
      password: user.password,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/warden/profile
exports.updateWardenProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { name, email, password } = req.body;
    if (name) user.fullName = name;
    if (email) user.email = email;
    if (password) user.password = password; // Should hash in real app
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};