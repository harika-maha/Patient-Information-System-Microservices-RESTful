const completedStatusValidation = (discharge) => {
    if (discharge.status === 'signed') {
      throw new Error('Cannot modify a signed discharge summary');
    }
  };

module.exports = { completedStatusValidation }