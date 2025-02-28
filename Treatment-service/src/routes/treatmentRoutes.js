const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');
const { departmentMiddleware } = require('../middleware/departmentMiddleware');

router.post(
  '/:id',
  verifyToken,
  verifyRole(['doctor']),
  departmentMiddleware(['Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology']),
  treatmentController.createTreatmentRecord
);

router.put('/:id',
  verifyToken,
  verifyRole(['doctor','nurse']),
  treatmentController.updateTreatmentRecord
);

router.get('/view/:id',
  verifyToken,
  verifyRole(['doctor', 'nurse']),
  treatmentController.viewTreatmentRecord
);

router.delete('/delete/:id',
  verifyToken,
  verifyRole(['doctor','nurse']),
  treatmentController.deleteTreatmentRecord
);

router.post('/:id/prescription', 
  verifyToken, 
  verifyRole(['doctor']), 
  treatmentController.appendTreatmentPrescription
);

module.exports = router;