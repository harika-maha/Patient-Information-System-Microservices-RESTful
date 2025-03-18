const patientService = require('../services/patientService');
const Patient = require('../models/patientModel');

exports.registerPatient = async (req, res) => {
  try {
    const existingPatient = await Patient.findOne({ patientId: req.body.patientId });
        if (existingPatient) {
            return res.status(409).json({ error: 'Patient ID already exists' });
        }
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
    const patientId = req.params.patientId;
    const patient = await patientService.getPatientDetailById(patientId);
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePatientDetails = async (req, res) => {
  try {
    const  patientId = req.params.patientId;
    const {patientData}=req.body.patientData;


    // Validate patientId in the request body
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const existingPatient = await Patient.findOne({ patientId});
    if (!existingPatient) {
        return res.status(400).json({ error: 'Patient ID not found' });
    }



    // Call the service to handle the update logic
    const updatedPatient = await patientService.updatePatientDetails(patientId,patientData);

    res.status(200).json({
      message: 'Patient details updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'An error occurred while updating patient details.' });
  }
};


