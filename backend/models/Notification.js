const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: [
            'leave_submitted',
            'hod_approved',
            'hod_rejected',
            'warden_approved',
            'warden_rejected',
            'gate_pass_generated'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    data: {
        leaveRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveRequest' },
        gatePassId: { type: mongoose.Schema.Types.ObjectId, ref: 'GatePass' },
        additionalData: mongoose.Schema.Types.Mixed
    },
    channels: {
        inApp: {
            sent: { type: Boolean, default: false },
            read: { type: Boolean, default: false },
            readAt: { type: Date }
        },
        email: {
            sent: { type: Boolean, default: false },
            sentAt: { type: Date },
            deliveryStatus: { type: String }
        },
        sms: {
            sent: { type: Boolean, default: false },
            sentAt: { type: Date },
            deliveryStatus: { type: String }
        },
        whatsapp: {
            sent: { type: Boolean, default: false },
            sentAt: { type: Date },
            deliveryStatus: { type: String }
        }
    },
    expiresAt: {
        type: Date
    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);