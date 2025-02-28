const validateDischargeUpdate = (data) => {
    //fields that can be updated
    const allowedFields = ['homeCarePlan', 'medications', 'referrals', 'status'];
    const invalidFields = Object.keys(data).filter(key => !allowedFields.includes(key));
    
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
    }
  };
  
  module.exports = {
    validateDischargeUpdate
  };