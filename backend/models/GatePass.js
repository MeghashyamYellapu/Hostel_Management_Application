const mongoose = require('mongoose');

const GatePassSchema = new mongoose.Schema({
    passId: {
        type: String,
        required: true,
        unique: true
    },
    leaveRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveRequest',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issuedDate: {
        type: Date,
        default: Date.now
    },
    validFrom: {
        type: Date,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'used', 'expired', 'cancelled'],
        default: 'active'
    },
    qrCode: {
        type: String, // Storing the URL or Base64 string of the QR code
        required: true
    },
    encryptedData: {
        type: String, // For verification
        required: true
    },
    exitTime: {
        type: Date
    },
    entryTime: {
        type: Date
    },
    exitGate: {
        type: String
    },
    entryGate: {
        type: String
    },
    securityOfficer: {
        exit: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        entry: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    revokedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    revokedAt: {
        type: Date
    },
    revokeReason: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('GatePass', GatePassSchema);