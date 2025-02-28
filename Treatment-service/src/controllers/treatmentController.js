const { 
  createTreatment,
  updateTreatment, 
  viewTreatment,
  deleteTreatment,
  appendPrescription,
} = require('../services/index');

const createTreatmentRecord = async (req, res) => {
  try {
    const userData = {
      id: req.user.id,
      department: req.user.department,
      authHeader: req.headers.authorization
    };
    const patientId = req.params.id;
    const treatment = await createTreatment(patientId, req.body, userData);
    res.status(201).json(treatment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTreatmentRecord = async (req, res) => {
  try {
    const updatedTreatment = await updateTreatment(req.params.id, req.body, req.user.id);
    res.json(updatedTreatment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const appendTreatmentPrescription = async (req, res) => {
  try {
    const updatedTreatment = await appendPrescription(req.params.id, req.body, req.user.id);
    res.json(updatedTreatment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const viewTreatmentRecord = async (req, res) => {
  try {
    const treatment = await viewTreatment(req.params.id);
    res.json(treatment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteTreatmentRecord = async (req, res) => {
  try {
    const result = await deleteTreatment(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { 
  createTreatmentRecord, 
  viewTreatmentRecord, 
  updateTreatmentRecord, 
  deleteTreatmentRecord, 
  appendTreatmentPrescription, 
};