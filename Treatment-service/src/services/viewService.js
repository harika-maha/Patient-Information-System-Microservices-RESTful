const Treatment = require('../models/treatmentModel.js');

const viewTreatmentRecord = async (patientId) => {
  const treatment = await Treatment.findOne({ patientId: patientId });

  if (!treatment) {
    throw new Error('Treatment record not found');
  }

  return treatment;
};

module.exports = { viewTreatmentRecord };