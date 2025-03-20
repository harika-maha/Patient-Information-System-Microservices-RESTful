//const authMiddleware = require('..../Authentication-Service/middleware/authMiddleware');


const express = require('express');
const patientController = require('../controllers/patientController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', verifyToken, verifyRole(['clerk', 'admin']), patientController.registerPatient);
router.get('/all', verifyToken, verifyRole(['admin', 'doctor', 'nurse','clerk','paramedic']), patientController.getAllPatients);
router.get('/:patientId',verifyToken,verifyRole(['admin', 'doctor', 'nurse','clerk','paramedic']),patientController.getPatientById);
router.put('/update/:patientId', 
    verifyToken, 
    verifyRole(['admin', 'clerk']), 
    patientController.updatePatientDetails
);



module.exports = router;
