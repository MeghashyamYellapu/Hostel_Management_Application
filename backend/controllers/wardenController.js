const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await LeaveRequest.find({
            currentStage: 'warden',
            status: 'hod_approved'
        })
        .populate('student', 'fullName pin branch year photo'); // Include 'photo'
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