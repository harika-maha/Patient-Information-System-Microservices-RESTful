const Discharge = require('../models/dischargeModel');

const viewDischargeSummary = async (patientId) => {
  const discharge = await Discharge.find({patientId: patientId});
  if (!discharge) {
    throw new Error('Discharge summary not found');
  }
  return discharge;
};

module.exports = { viewDischargeSummary };