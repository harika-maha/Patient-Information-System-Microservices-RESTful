const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
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
  diagnosis: {
    type: String,
    required: true
  },
  treatmentPlan: { 
    type: String,
    required: true
  },
  procedures: [{
    name: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    outcome: {
      type: String
    }
  }],
  progressNotes: [{
    date: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      required: true
    }
  }],
  prescriptions: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  }],
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
    createdAt: { type: Date, default: Date.now }
  }],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  treatmentStatus: {
    type: String,
    enum: ['ongoing', 'completed'],
    default: 'ongoing'
  },
  doctorNotes: {
    type: String
  }
}, { timestamps: true, collection: 'TreatmentRecords' });

module.exports = mongoose.model('Treatment', treatmentSchema);