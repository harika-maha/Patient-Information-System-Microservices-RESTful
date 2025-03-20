//const authMiddleware = require('..../Authentication-Service/middleware/authMiddleware');


const express = require('express');
const patientController = require('../controllers/patientController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new patient
 *     description: This endpoint allows a clerk or admin to register a new patient with the necessary details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: "P0012"
 *               firstName:
 *                 type: string
 *                 example: "Chali"
 *               lastName:
 *                 type: string
 *                 example: "Chek"
 *               age:
 *                 type: integer
 *                 example: 22
 *               gender:
 *                 type: string
 *                 example: "Female"
 *               contactNumber:
 *                 type: string
 *                 example: "9712232323"
 *               department:
 *                 type: string
 *                 example: "Orthopedics"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Dubai, UAE"
 *               medicalHistory:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Diabetes"
 *               complaints:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "headAche"
 *     responses:
 *       201:
 *         description: Patient successfully registered
 *       400:
 *         description: Bad request, invalid input data
 *       403:
 *         description: Forbidden, user does not have the required role (clerk, admin)
 *       500:
 *         description: Internal server error
 */
router.post('/register', verifyToken, verifyRole(['clerk', 'admin']), patientController.registerPatient);

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Get all patients
 *     description: This endpoint allows an authorized user to view all patient records.
 *     responses:
 *       200:
 *         description: Successfully retrieved list of all patients
 *       403:
 *         description: Forbidden, user does not have the required role (admin, doctor, nurse, clerk, paramedic)
 *       500:
 *         description: Internal server error
 */
router.get('/all', verifyToken, verifyRole(['admin', 'doctor', 'nurse','clerk','paramedic']), patientController.getAllPatients);


/**
 * @swagger
 * /{patientId}:
 *   get:
 *     summary: Get patient by ID
 *     description: This endpoint allows an authorized user to view a specific patient's record by their ID.
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         description: The ID of the patient to retrieve
 *         schema:
 *           type: string
 *           example: "P12349"
 *     responses:
 *       200:
 *         description: Successfully retrieved the patient's record
 *       403:
 *         description: Forbidden, user does not have the required role (admin, doctor, nurse, clerk, paramedic)
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.get('/:patientId',verifyToken,verifyRole(['admin', 'doctor', 'nurse','clerk','paramedic']),patientController.getPatientById);


/**
 * @swagger
 * /update/{patientId}:
 *   put:
 *     summary: Update patient details
 *     description: This endpoint allows a clerk or admin to update the details of an existing patient.
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         description: The unique ID of the patient whose details are being updated
 *         schema:
 *           type: string
 *           example: "P0012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientData:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "Maya"
 *                   lastName:
 *                     type: string
 *                     example: "Chek"
 *                   age:
 *                     type: integer
 *                     example: 22
 *                   gender:
 *                     type: string
 *                     example: "Female"
 *                   contactNumber:
 *                     type: string
 *                     example: "9712232323"
 *                   department:
 *                     type: string
 *                     example: "Orthopedics"
 *                   address:
 *                     type: string
 *                     example: "123 Main Street, Dubai, UAE"
 *                   medicalHistory:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Diabetes"
 *                   complaints:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "headAche"
 *     responses:
 *       200:
 *         description: Patient details successfully updated
 *       400:
 *         description: Bad request, invalid input data
 *       403:
 *         description: Forbidden, user does not have the required role (clerk, admin)
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:patientId', 
    verifyToken, 
    verifyRole(['admin', 'clerk']), 
    patientController.updatePatientDetails
);



module.exports = router;
