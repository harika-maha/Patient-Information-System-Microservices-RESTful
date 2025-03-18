const Patient = require("../models/patientModel");

// Create a new patient
const createPatient = async (data) => {
  return await Patient.create(data);
};

// Get all patients
const getAllPatients = async () => {
  return await Patient.find();
};

// Get patient by PatientId
const getPatientDetailById = async (patientId) => {
  return await Patient.findOne({patientId});
};

//update patient details
const updatePatientDetails = async (patientId,patientData) => {


  const updatedPatient = await Patient.findOneAndUpdate(
      { patientId },                   
      { $set: patientData },     // Update only provided fields
      { new: true, runValidators: true } // Return updated patient with validation
  );

  if (!updatedPatient) {
      throw new Error('Failed to update patient details');
  }

  return updatedPatient;
};


module.exports = {
  createPatient,
  getAllPatients,
  getPatientDetailById,
  updatePatientDetails
 
};
