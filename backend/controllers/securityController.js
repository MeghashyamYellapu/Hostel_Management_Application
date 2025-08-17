const LeaveRequest = require('../models/LeaveRequest');
const GatePass = require('../models/GatePass');
const User = require('../models/User');
const qrcode = require('qrcode');
const { encrypt, decrypt } = require('../utils/encryption');
const notificationService = require('../services/notificationService');

const generatePassId = async () => {
    const count = await GatePass.countDocuments();
    return `GP-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
};

exports.getApprovedRequests = async (req, res) => {
    try {
        const requests = await LeaveRequest.find({
            currentStage: 'security',
            status: 'warden_approved'
        })
        .populate('student', 'fullName pin branch year photo'); // Include 'photo'
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getActivePasses = async (req, res) => {
    try {
        const passes = await GatePass.find({ status: 'active' }).populate('student', 'fullName pin photo').sort({ validFrom: -1 });
        res.status(200).json(passes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.generateGatePass = async (req, res) => {
    try {
        const requestId = req.params.id;
        const securityId = req.user.id;
        const leaveRequest = await LeaveRequest.findById(requestId).populate('student');
        if (!leaveRequest || leaveRequest.currentStage !== 'security') {
            return res.status(403).json({ message: 'Not authorized to generate a pass for this request' });
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

        console.log("Attempting to save newGatePass document:", newGatePass); // This is the new line

        await newGatePass.save();

        leaveRequest.securityApproval = {
            approvedBy: securityId,
            status: 'approved',
            comments: 'Gate Pass generated.',
            timestamp: new Date()
        };
        leaveRequest.status = 'security_approved';
        leaveRequest.currentStage = 'completed';
        await leaveRequest.save();

        // ... (rest of the code is the same)
        res.status(201).json({ message: 'Gate pass generated successfully', gatePass: newGatePass });
    } catch (err) {
        console.error("Error in generateGatePass:", err);
        res.status(500).json({ message: 'Server error', details: err.message });
    }
};

exports.scanGatePass = async (req, res) => {
    try {
        const { encryptedData, gate } = req.body;
        const securityId = req.user.id;
        const decryptedData = JSON.parse(decrypt(encryptedData));
        const gatePass = await GatePass.findOne({ passId: decryptedData.passId });
        if (!gatePass) {
            return res.status(404).json({ message: 'Invalid or expired pass.' });
        }
        if (gatePass.validUntil < new Date()) {
            gatePass.status = 'expired';
            await gatePass.save();
            return res.status(400).json({ message: 'Gate pass has expired.' });
        }
        let action = '';
        if (!gatePass.exitTime) {
            gatePass.exitTime = new Date();
            gatePass.exitGate = gate;
            gatePass.securityOfficer.exit = securityId;
            action = 'exit';
            notificationService.sendNotification(
                gatePass.student._id,
                'Exit Logged',
                `You have successfully exited the campus.`,
                'exit_logged',
                { gatePassId: gatePass._id }
            );
        } else if (!gatePass.entryTime) {
            gatePass.entryTime = new Date();
            gatePass.entryGate = gate;
            gatePass.securityOfficer.entry = securityId;
            gatePass.status = 'used';
            action = 'entry';
            notificationService.sendNotification(
                gatePass.student._id,
                'Entry Logged',
                `You have successfully returned to the campus.`,
                'entry_logged',
                { gatePassId: gatePass._id }
            );
        } else {
            return res.status(400).json({ message: 'Pass already used for both exit and entry.' });
        }
        await gatePass.save();
        res.status(200).json({ message: `Student ${action} logged successfully.`, gatePass });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', details: err.message });
    }
};