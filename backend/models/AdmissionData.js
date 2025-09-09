const mongoose = require('mongoose');

const AdmissionDataSchema = new mongoose.Schema({
  pin: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  admissionNumber: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('AdmissionData', AdmissionDataSchema);