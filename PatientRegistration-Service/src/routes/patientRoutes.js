//const authMiddleware = require('..../Authentication-Service/middleware/authMiddleware');


const express = require('express');
const patientController = require('../controllers/patientController');
const { verifyToken } = require('../middleware/AuthMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', verifyToken, verifyRole(['clerk', 'admin']), patientController.registerPatient);
router.get('/:id',verifyToken,verifyRole(['admin', 'doctor', 'nurse','clerk','paramedic']),patientController.getPatientById);
router.get('/all', verifyToken, verifyRole(['admin', 'doctor', 'nurse','clerk','paramedic']), patientController.getAllPatients);

module.exports = router;
