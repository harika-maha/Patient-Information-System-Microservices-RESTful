const mongoose = require('mongoose');

const uri = process.env.PATIENT_DB_URI
const connectDB = async () => {
  try {
    await mongoose.connect(uri)
    console.log('Connected to Patient Database');
  } catch (error) {
    console.error('Patient Database Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
