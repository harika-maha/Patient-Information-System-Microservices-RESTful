const Treatment = require('../models/treatmentModel.js');
const { validateTreatmentUpdate } = require('../utils/completedStatusValidation.js');
const { completedStatusValidation } = require('../utils/signedStatusValidation.js');

const appendPrescription = async (patientId, newPrescription, userId) => {
  const treatment = await Treatment.findOne({ patientId: patientId });

  if (!treatment) {
    throw new Error('Treatment record not found');
  }

  console.log('User ID:', userId);
  console.log('Doctor ID:', treatment.doctorId);

  completedStatusValidation(treatment);

  if (treatment.doctorId !== userId) {
    throw new Error('Not authorized to update this treatment record');
  }

  treatment.prescriptions.push({
    ...newPrescription
  });

  return await treatment.save();
};

const updateTreatmentRecord = async (patientId, updateData, userId) => {
  const treatment = await Treatment.findOne({ patientId: patientId });

  if (!treatment) {
    throw new Error('Treatment record not found');
  }

  if (treatment.doctorId !== userId) {
    throw new Error('Not authorized to update this treatment record');
  }

  completedStatusValidation(treatment);
  validateTreatmentUpdate(updateData);

  Object.assign(treatment, updateData);
  return await treatment.save();
};

module.exports = { updateTreatmentRecord, appendPrescription };