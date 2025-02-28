const mongoose=require('mongoose')

const patientSchema = new mongoose.Schema({
    patientId: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    department: {
        type: String,
        enum: ['Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology']
      },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    medicalHistory: { type: [String], default: [] }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Patient', patientSchema);