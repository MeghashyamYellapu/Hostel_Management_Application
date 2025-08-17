const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'hod', 'warden', 'security', 'admin'], required: true },
  phone: { type: String },
  pin: { type: String, unique: true, sparse: true },
  branch: { type: String },
  year: { type: String },
  photo: { public_id: String, secure_url: String }, // The single, correct definition
  parentPhone: { type: String },
  guardianPhone: { type: String },
  roomNumber: { type: String },
  department: { type: String },
  designation: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);