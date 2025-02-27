const Treatment = require('../models/treatmentModel.js');

const deleteTreatmentRecord = async (patientId, userId) => {
  const treatment = await Treatment.findOne({ patientId: patientId });
  
  if (!treatment) {
    throw new Error('Treatment record not found');
  }

  if (treatment.doctorId !== userId) {
    throw new Error('Not authorized to delete this treatment record');
  }

  await Treatment.findOneAndDelete({ patientId: patientId });

  return { message: 'Treatment record deleted successfully' };
};

module.exports = { deleteTreatmentRecord };