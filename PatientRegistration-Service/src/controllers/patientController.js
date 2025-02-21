const patientService = require('../services/patientService');

exports.registerPatient = async (req, res) => {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await patientService.getAllPatients();
    res.json(patients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await patientService.getPatientDetailById(patientId);
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
