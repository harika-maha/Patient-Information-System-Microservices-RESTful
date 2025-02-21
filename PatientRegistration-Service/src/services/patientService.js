const Patient = require("../models/patientModel");

// Create a new patient
const createPatient = async (data) => {
  return await Patient.create(data);
};

// Get all patients
const getAllPatients = async () => {
  return await Patient.find();
};

// Get all patients
const getPatientDetailById = async (id) => {
  return await Patient.findOne({patientId:id});
};


module.exports = {
  createPatient,
  getAllPatients,
  getPatientDetailById,
  
};
