const mongoose = require('mongoose')

const dischargeSummarySchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  patientDetails: {
    firstname: {
    type: String,
    required: true
    },
    lastname: {
    type: String,
    required: true
    },
    age: {
    type: Number, 
    required: true 
    },
    department: {
    type: String,
    enum: ['Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology']
    }
  },
  doctorId: { 
    type: String,
    required: true
  },
  homeCarePlan: { 
    type: String,
    required: true
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  status: {
    type: String,
    enum: ['draft', 'signed'],
    default: 'draft'
  },
  referrals: [{
    department: {
      type: String,
      required: true,
      enum: ["Medicine", "Surgery", "Orthopedics", "Pediatrics", "ENT", "Ophthalmology", "Gynecology", "Dermatology", "Oncology"]
    },
    serviceType: {
      type: String,
      required: true,
      enum: ["Radiology", "Pathology", "Physiotherapy", "Blood Bank", "Operation Theatre"]
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED'],
      default: 'SCHEDULED'
    },
    notes: String,
    createdAt: {type: Date, default: Date.now}
  }]
}, { timestamps: true, collection: 'DischargeSummary'});

module.exports = mongoose.model('Discharge', dischargeSummarySchema);