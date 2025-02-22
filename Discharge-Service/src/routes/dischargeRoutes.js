const express = require('express');
const router = express.Router();
const dischargeController = require('../controllers/dischargeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');
const { departmentMiddleware } = require('../middleware/departmentMiddleware');

router.post(
  '/:id',
  verifyToken,
  verifyRole(['doctor']),
  departmentMiddleware(['Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology']),
  dischargeController.createSummary
);
router.put('/:id',
  verifyToken,
  verifyRole(['doctor']),
  dischargeController.updateSummary
 );
 
 router.get('/view/:id',
  verifyToken,
  verifyRole(['doctor', 'nurse']),
  dischargeController.viewSummary
 );
 
 router.delete('/delete/:id',
  verifyToken,
  verifyRole(['doctor']),
  dischargeController.deleteSummary
 );

 router.post('/:id/referral', 
  verifyToken, 
  verifyRole(['doctor']), 
  dischargeController.appendSummaryReferral
);

module.exports = router;