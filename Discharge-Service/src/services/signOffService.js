const Discharge = require('../models/dischargeModel');

const signOffDischargeSummary = async (patientId, userId) => {
    const discharge = await Discharge.findOne({patientId: patientId});
    if (!discharge) {
      throw new Error('Discharge summary not found');
    }
  
    if (discharge.doctorId.toString() !== userId) {
      throw new Error('Unauthorized to sign off this discharge summary');
    }
    if (discharge.status === 'signed') {
      throw new Error('Discharge summary already signed off');
    }
    discharge.status = 'signed';
    return await discharge.save();
  };

  module.exports = {
    signOffDischargeSummary
  };