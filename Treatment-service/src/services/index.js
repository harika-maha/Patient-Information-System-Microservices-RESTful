const { createTreatmentRecord: createTreatment } = require('./createService');
const { updateTreatmentRecord: updateTreatment, appendPrescription } = require('./updateService');
const { viewTreatmentRecord:viewTreatment } = require('./viewService');
const { deleteTreatmentRecord: deleteTreatment } = require('./deleteService');
module.exports = {
  createTreatment,  
  updateTreatment,
  viewTreatment,
  deleteTreatment, 
  appendPrescription
};