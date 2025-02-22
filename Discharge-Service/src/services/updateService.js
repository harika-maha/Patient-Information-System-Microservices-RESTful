const Discharge = require('../models/dischargeModel');
const { validateDischargeUpdate } = require('../utils/dischargeValidation');
const { signedStatusValidation } = require('../utils/signedStatusValidation')

const appendReferral = async (patientId, newReferral, userId) => {
  const discharge = await Discharge.findOne({patientId: patientId});
  if (!discharge) {
    throw new Error('Discharge summary not found');
  }
  console.log('User ID:', userId);
  console.log('Doctor ID:', discharge.doctorId);
  signedStatusValidation(discharge);

  if (discharge.doctorId !== userId) {
    throw new Error('Not authorized to update this discharge summary');
  }

  discharge.referrals.push({
    ...newReferral
  });

  return await discharge.save();
};

const updateDischargeSummary = async (patientId, updateData, userId) => {
  const discharge = await Discharge.findOne({patientId: patientId});
  if (!discharge) {
    throw new Error('Discharge summary not found');
  }
  if (discharge.doctorId !== userId) {
    throw new Error('Not authorized to update summary');
  }
  signedStatusValidation(discharge);
  validateDischargeUpdate(updateData);

  Object.assign(discharge, updateData);
  return await discharge.save();
};

module.exports = { updateDischargeSummary, appendReferral };