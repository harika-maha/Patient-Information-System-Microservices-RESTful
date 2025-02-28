const Treatment = require('../models/treatmentModel.js'); // Updated model reference
const axios = require('axios');

const getPatientDetails = async (patientId, authHeader) => {
  try {
    const response = await axios.get(`${process.env.PATIENT_SERVICE_URL}/${patientId}`, {
      headers: {
        'Authorization': authHeader
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient details:', error?.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error('Patient not found');
    } else if (error.response?.status === 401) {
      throw new Error('Unauthorized access');
    }
    throw new Error(`Error connecting to patient service: ${error.message}`);
  }
};

const createTreatmentRecord = async (patientId, data, userData) => {
  const { diagnosis, treatmentPlan, prescriptions, referrals } = data;
  
  // Fetch patient data from external API
  const patientData = await getPatientDetails(patientId, userData.authHeader);

  const treatmentData = {
    patientId,
    patientDetails: {
      firstname: patientData.firstName,
      lastname: patientData.lastName,
      age: patientData.age,
      department: userData.department
    },
    doctorId: userData.id,
    diagnosis, 
    treatmentPlan,
    prescriptions,
    status: 'ongoing' // Default status for active treatments
  };

  const referralsList = Array.isArray(referrals) ? referrals : [];
  if (referralsList.length > 0) {
    treatmentData.referrals = referralsList.map(referral => ({
      ...referral
    }));
  }

  // Create new treatment record
  try {
    const treatmentRecord = new Treatment(treatmentData);
    const savedTreatmentRecord = await treatmentRecord.save();
    return savedTreatmentRecord;
  } catch (error) {
    throw new Error('Error saving treatment record: ' + error.message);
  }
};

module.exports = { createTreatmentRecord };