const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService');

exports.getPendingRequests = async (req, res) => {
    try {
        const hod = req.user;
        if (hod.role.toLowerCase() !== 'hod' || !hod.department) {
            return res.status(403).json({ message: 'Not authorized as an HOD or department not found' });
        }
        const requests = await LeaveRequest.find({
            currentStage: 'hod',
            status: 'pending'
        })
        .populate('student', 'fullName pin branch year photo');
        const departmentRequests = requests.filter(req => req.student.branch === hod.department);
        res.status(200).json(departmentRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { status, comments } = req.body;
        const requestId = req.params.id;
        const hodId = req.user.id;
        const leaveRequest = await LeaveRequest.findById(requestId).populate('student');
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        if (leaveRequest.student.branch !== req.user.department || leaveRequest.currentStage !== 'hod') {
            return res.status(403).json({ message: 'Not authorized to approve this request' });
        }
        leaveRequest.hodApproval = {
            approvedBy: hodId,
            status: status,
            comments: comments,
            timestamp: new Date()
        };
        leaveRequest.status = status === 'approved' ? 'hod_approved' : 'hod_rejected';
        leaveRequest.currentStage = status === 'approved' ? 'warden' : 'completed';
        leaveRequest.statusHistory.push({
            status: leaveRequest.status,
            timestamp: new Date(),
            updatedBy: hodId,
            comments: comments
        });
        await leaveRequest.save();

        // --- Notification Logic ---
        if (leaveRequest.currentStage === 'warden') {
            const wardens = await User.find({ role: 'warden' });
            if (wardens.length > 0) {
                const subject = `HOD ${status} Leave Request from ${leaveRequest.student.fullName}`;
                const formattedMessage = `
                    <h1>Leave Request: ${subject}</h1>
                    <p><strong>Student Name:</strong> ${leaveRequest.student.fullName}</p>
                    <p><strong>PIN Number:</strong> ${leaveRequest.student.pin}</p>
                    <p><strong>Reason:</strong> ${leaveRequest.reason}</p>
                    <p><strong>HOD Comments:</strong> ${comments}</p>
                    <p>The request is now awaiting your final approval. Please log in to the portal to review.</p>
                `;
                for (const warden of wardens) {
                    await emailService.sendEmail(warden.email, subject, formattedMessage);
                    notificationService.sendNotification(
                        warden._id,
                        subject,
                        `A leave request from ${leaveRequest.student.fullName} has been approved by the HOD and is awaiting your review.`,
                        'hod_approved',
                        { leaveRequestId: leaveRequest._id }
                    );
                }
            }
        }
        // --- End Notification Logic ---
        
        res.status(200).json({ message: `Request ${status} successfully`, leaveRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/hod/profile
exports.getHodProfile = async (req, res) => {
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

// PUT /api/hod/profile
exports.updateHodProfile = async (req, res) => {
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