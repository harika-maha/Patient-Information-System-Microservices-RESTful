const Discharge = require('../models/dischargeModel');
const { validateUpdate } = require('../utils/dischargeValidation');

const appendReferral = async (patientId, newReferral, userId) => {
  const discharge = await Discharge.findOne({patientId: patientId});
  if (!discharge) {
    throw new Error('Discharge summary not found');
  }
  console.log('User ID:', userId);
  console.log('Doctor ID:', discharge.doctorId);
  if (discharge.doctorId !== userId) {
    throw new Error('Not authorized to update this discharge summary');
  }

  discharge.referrals.push({
    ...newReferral
  });

  return await discharge.save();
};

const updateDischargeSummary = async (patientId, updateData, userId) => {
  validateUpdate(updateData);
  
  const discharge = await Discharge.find({patientId: patientId});
  if (!discharge) {
    throw new Error('Discharge summary not found');
  }
  
  if (discharge.doctorId !== userId) {
    throw new Error('Not authorized to update summary');
  }

  Object.assign(discharge, updateData);
  return await discharge.save();
};

module.exports = { updateDischargeSummary, appendReferral };