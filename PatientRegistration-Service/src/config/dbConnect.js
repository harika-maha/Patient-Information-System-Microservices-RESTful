const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.PATIENT_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to Patient Database');
  } catch (error) {
    console.error('Patient Database Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
