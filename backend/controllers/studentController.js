const LeaveRequest = require('../models/LeaveRequest');
const GatePass = require('../models/GatePass');
const User = require('../models/User');
const qrcode = require('qrcode');
const { encrypt } = require('../utils/encryption');
const notificationService = require('../services/notificationService');
const AdmissionData = require('../models/AdmissionData'); // Import the new model

const generateRequestId = async () => {
    let newRequestId;
    let isUnique = false;
    let count = await LeaveRequest.countDocuments();
    while (!isUnique) {
        newRequestId = `LR-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
        const existingRequest = await LeaveRequest.findOne({ requestId: newRequestId });
        if (!existingRequest) {
            isUnique = true;
        } else {
            count++;
        }
    }
    return newRequestId;
};

const generatePassId = async () => {
    let newPassId;
    let isUnique = false;
    let count = await GatePass.countDocuments();
    while (!isUnique) {
        newPassId = `GP-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
        const existingPass = await GatePass.findOne({ passId: newPassId });
        if (!existingPass) {
            isUnique = true;
        } else {
            count++;
        }
    }
    return newPassId;
};

exports.createLeaveRequest = async (req, res) => {
    try {
        const { leaveType, reason, startDate, endDate, startTime, endTime, emergencyContact, additionalComments } = req.body;
        const studentId = req.user.id;
        
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

        const approverRole = newRequest.currentStage;
        let approvers = [];

        if (approverRole === 'hod') {
            const normalizedBranch = student.branch.toLowerCase().trim();
            approvers = await User.find({ 
                role: 'hod', 
                department: { $regex: new RegExp(`^${normalizedBranch}$`, 'i') } 
            });
        } else if (approverRole === 'warden') {
            approvers = await User.find({ role: 'warden' });
        }

        if (approvers.length > 0) {
            const subject = `New Leave Request from ${student.fullName}`;
            
            const uploadedPhotoUrl = student.photo?.secure_url || 'https://via.placeholder.com/100?text=No+Photo';
            
            // --- FETCHING DATA FROM MONGODB ---
            const officialData = await AdmissionData.findOne({ pin: student.pin });
            const officialPhotoUrl = officialData?.admissionNumber ? `https://media.campx.in/cec/student-photos/${officialData.admissionNumber}.jpg` : 'https://via.placeholder.com/100?text=No+Photo';
            // --- END FETCHING DATA ---
            
            const formattedMessage = `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #2563eb;">New Leave Request: ${subject}</h2>
                    
                    <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
                        <div style="text-align: center;">
                            <img src="${uploadedPhotoUrl}" alt="Uploaded Photo" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
                            <p style="font-size: 12px; margin-top: 5px;">Student Uploaded Photo</p>
                        </div>
                        <div style="text-align: center;">
                            <img src="${officialPhotoUrl}" alt="Official Photo" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
                            <p style="font-size: 12px; margin-top: 5px;">Official Photo (PIN: ${student.pin})</p>
                        </div>
                    </div>
                    
                    <p><strong>Student Name:</strong> ${student.fullName}</p>
                    <p><strong>PIN Number:</strong> ${student.pin}</p>
                    <p><strong>Branch:</strong> ${student.branch}</p>
                    <p><strong>Leave Type:</strong> ${leaveType}</p>
                    <p><strong>Reason:</strong> ${reason}</p>
                    <p><strong>Duration:</strong> ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}</p>
                    <p>Awaiting your approval. Please log in to the portal to review the request.</p>
                </div>
            `;

            for (const approver of approvers) {
                notificationService.sendNotification(
                    approver._id,
                    subject,
                    formattedMessage,
                    'leave_submitted',
                    { leaveRequestId: newRequest._id }
                );
            }
        }
        res.status(201).json({ message: 'Leave request submitted successfully', request: newRequest });
    } catch (err) {
        console.error("Error submitting leave request:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentLeaveRequests = async (req, res) => {
    try {
        const studentId = req.user.id;
        const requests = await LeaveRequest.find({ student: studentId })
            .populate('student', 'fullName branch year photo') // Corrected populate to include photo
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSingleLeaveRequest = async (req, res) => {
    try {
        const request = await LeaveRequest.findById(req.params.id).populate('student', 'fullName pin branch year photo');
        if (!request || request.student._id.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(request);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

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