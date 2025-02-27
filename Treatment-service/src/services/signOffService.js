const Treatment = require('../models/treatmentModel.js');

const completeTreatmentRecord = async (patientId, userId) => {
  const treatment = await Treatment.findOne({ patientId: patientId });

  if (!treatment) {
    throw new Error('Treatment record not found');
  }

  if (treatment.doctorId.toString() !== userId) {
    throw new Error('Unauthorized to complete this treatment record');
  }

  if (treatment.status === 'completed') {
    throw new Error('Treatment record is already marked as completed');
  }

  treatment.status = 'completed';
  return await treatment.save();
};

module.exports = {
  completeTreatmentRecord
};