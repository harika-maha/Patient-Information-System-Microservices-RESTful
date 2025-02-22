const { createDischargeSummary } = require('./createService');
const { updateDischargeSummary, appendReferral } = require('./updateService');
const { viewDischargeSummary } = require('./viewService');
const { deleteDischargeSummary } = require('./deleteService');

module.exports = {
  createDischargeSummary,
  updateDischargeSummary,
  viewDischargeSummary,
  deleteDischargeSummary, 
  appendReferral
};