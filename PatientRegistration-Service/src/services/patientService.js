const Patient = require("../models/patientModel");
const VALID_DEPARTMENTS = [
  'Medicine',
  'Surgery',
  'Orthopedics',
  'Pediatrics',
  'ENT',
  'Ophthalmology',
  'Gynecology',
  'Dermatology',
  'Oncology'
];
// Create a new patient
const createPatient = async ({ patientId,firstName,lastName, age, gender,contactNumber,department,address,medicalHistory,complaints })  => {
  try{  

     const existingUser = await Patient.findOne({ patientId });
     if (existingUser) throw new Error('patientId already exists');
     
     //  Contact Number Validation Logic
     if (!/^[0-9]{10}$/.test(contactNumber)) {
      throw new Error('Contact number must be exactly 10 digits');
     }
     
     // Department Validation Logic
     if (!VALID_DEPARTMENTS.includes(department)) {
      throw new Error(`Invalid department. Allowed values are: ${VALID_DEPARTMENTS.join(', ')}`);
  }
    const patient = new Patient({ patientId,firstName,lastName, age, gender,contactNumber,department,address,medicalHistory,complaints });
    await patient.save();
    return { patientId:patient.patientId, firstName: patient.firstName,lastName:patient.lastName,age:patient.age,gender:patient.gender, contactNumber: patient.contactNumber,department:patient.department,address:patient.address,medicalHistory:patient.medicalHistory,complaints:patient.complaints };
  }
  catch(error){
   throw new Error(error);
  }
  
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

 if(!patientId){
  throw new Error('PatientId not found');
 }


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
