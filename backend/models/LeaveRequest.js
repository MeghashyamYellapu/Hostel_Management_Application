const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leaveType: {
    type: String,
    enum: ['day-pass', 'overnight', 'extended', 'emergency'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  duration: {
    type: Number
  },
  emergencyContact: {
    type: String
  },
  additionalComments: {
    type: String
  },
  hodApproval: {
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    comments: { type: String },
    timestamp: { type: Date }
  },
  wardenApproval: {
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    comments: { type: String },
    timestamp: { type: Date }
  },
  securityApproval: {
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    comments: { type: String },
    timestamp: { type: Date }
  },
  status: {
    type: String,
    enum: ['pending', 'hod_approved', 'hod_rejected', 'warden_approved', 'warden_rejected', 'security_approved', 'security_rejected', 'gate_pass_generated'], // Added 'gate_pass_generated'
    default: 'pending'
  },
  currentStage: {
    type: String,
    enum: ['hod', 'warden', 'security', 'completed'],
    default: 'hod'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);