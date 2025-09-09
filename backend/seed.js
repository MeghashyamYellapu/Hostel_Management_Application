const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AdmissionData = require('./models/AdmissionData');
const { admissionData } = require('./data/admissionData');

dotenv.config();

const connectDB = require('./config/database');
connectDB();

const importData = async () => {
  try {
    // Clear old data
    await AdmissionData.deleteMany();
    console.log('Existing admission data cleared.');

    // Convert the data object into an array of documents
    const dataToInsert = Object.keys(admissionData).map(pin => ({
      pin,
      ...admissionData[pin]
    }));

    // Insert new data
    await AdmissionData.insertMany(dataToInsert);
    console.log('Admission data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();