const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

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
        .populate('student', 'fullName pin branch year photo'); // Include 'photo'
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