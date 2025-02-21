const Patient = require("../models/patientModel");

// Create a new patient
const createPatient = async (data) => {
  return await Patient.create(data);
};

// Get all patients
const getAllPatients = async () => {
  return await Patient.find();
};


module.exports = {
  createPatient,
  getAllPatients,
};
