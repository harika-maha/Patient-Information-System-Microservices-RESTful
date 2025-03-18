const mongoose=require('mongoose')

const validDepartments = [
  'Medicine', 'Surgery', 'Orthopedics', 'Pediatrics',
  'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology'
];


const patientSchema = new mongoose.Schema({
    patientId: { type: String, unique: true, required: [true, 'Patient ID is required'] },
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    age: { type: Number,required: [true, 'Age is required'], min: [0, 'Age cannot be negative'] },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: [true, 'Gender is required']  },
    department: {
      type: String,
      required: [true, 'Department is required'],
      validate: {
          validator: function(value) {
              return validDepartments.includes(value);
          },
          message: `Invalid department. Allowed values are: ${validDepartments.join(', ')}`
      },
    },
    contactNumber: { type: String, required: [true, 'Contact number is required'],
      match: [/^\d{10}$/, 'Contact number must be exactly 10 digits'] },
    address: { type: String, required:[true, 'Address is required']},
    medicalHistory: { type: [String], default: [] }
  }, {timestamps: true });
  
  module.exports = mongoose.model('Patient', patientSchema);