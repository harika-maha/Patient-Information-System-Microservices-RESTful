const Discharge = require('../models/dischargeModel');
const axios = require('axios');

const getPatientDetails = async (patientId, authHeader) => {
  try {
    // console.log('Making request to:', `${process.env.PATIENT_SERVICE_URL}/${patientId}`);
    const response = await axios.get(`${process.env.PATIENT_SERVICE_URL}/${patientId}`,{
        headers: {
          'Authorization': authHeader
        }
      }
    );
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Full error:', error);
    console.error('Error response:', error.response?.data);
    if (error.response?.status === 404) {
      throw new Error('Patient not found');
    } else if (error.response?.status === 401) {
      throw new Error('Unauthorized access');
    }
    throw new Error(`Error connecting to patient service: ${error.message}`);
  }
};

const createDischargeSummary = async (data, userData) => {
  const { patientId, homeCarePlan, medications, referrals } = data;
  
  //get patient data from the api call
  const patientData = await getPatientDetails(patientId, userData.authHeader);

  //create new discharge summary
  const dischargeSummary = new Discharge({
    patientId,
    patientDetails: {
      firstname: patientData.firstName,
      lastname: patientData.lastName,
      age: patientData.age,
      department: userData.department
    },
    doctorId: userData.id,
    homeCarePlan,
    medications,
    status: 'draft',
    referrals: referrals.map(referral => ({
      ...referral
    }))
  });

  try {
    const savedDischargeSummary = await dischargeSummary.save();
    return savedDischargeSummary;
  } catch (error) {
    throw new Error('Error saving discharge summary: ' + error.message);
  }
};

module.exports = { createDischargeSummary };