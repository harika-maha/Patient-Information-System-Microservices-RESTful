const { createTreatmentRecord } = require('./createService');
const { updateTreatmentRecord, appendPrescription } = require('./updateService');
const { viewTreatmentRecord } = require('./viewService');
const { deleteTreatmentRecord } = require('./deleteService');
const { completeTreatmentRecord } = require('./signOffService');

module.exports = {
  createTreatmentRecord,
  updateTreatmentRecord,
  viewTreatmentRecord,
  deleteTreatmentRecord, 
  appendPrescription,
  completeTreatmentRecord
};