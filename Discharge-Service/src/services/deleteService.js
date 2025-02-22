const Discharge = require('../models/dischargeModel');

const deleteDischargeSummary = async (patientId, userId) => {
  const discharge = await Discharge.findOne({patientId: patientId});
  if (!discharge) {
    throw new Error('Discharge summary not found');
  }

  if (discharge.doctorId !== userId) {
    throw new Error('Not authorized to delete this discharge summary');
  }

  await Discharge.findOneAndDelete({patientId: patientId});
  return { message: 'Discharge summary deleted successfully' };
};

module.exports = { deleteDischargeSummary };