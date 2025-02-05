const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true,
        required: true
      },
    username: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      role: {
        type: String,
        enum: ['admin', 'doctor', 'nurse', 'clerk', 'paramedic'],
        required: true
      },
      firstName: { type: String, required: true },
      lastName: { type: String },
      department: {
        type: String,
        enum: ['Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology']
      }},
      {collection: 'users'}
)

module.exports = userSchema