const { 
  createDischargeSummary,
  updateDischargeSummary, 
  viewDischargeSummary,
  deleteDischargeSummary,
  appendReferral
 } = require('../services/index');
 
 const createSummary = async (req, res) => {
  try {
    const userData = {
      id: req.user.id,
      department: req.user.department,
      authHeader: req.headers.authorization
    };
    
    const dischargeSummary = await createDischargeSummary(req.body, userData);
    res.status(201).json(dischargeSummary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
 };
 
 const updateSummary = async (req, res) => {
  try {
    const updatedSummary = await updateDischargeSummary(req.params.id, req.body, req.user.id);
    res.json(updatedSummary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
 };

 const appendSummaryReferral = async (req, res) => {
  try {
    const updatedSummary = await appendReferral(req.params.id, req.body, req.user.id);
    res.json(updatedSummary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
 
const viewSummary = async (req, res) => {
  try {
    const summary = await viewDischargeSummary(req.params.id);
    res.json(summary);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
 };
 
 const deleteSummary = async (req, res) => {
  try {
    const result = await deleteDischargeSummary(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
 };

 module.exports = {createSummary, viewSummary, updateSummary, deleteSummary, appendSummaryReferral}