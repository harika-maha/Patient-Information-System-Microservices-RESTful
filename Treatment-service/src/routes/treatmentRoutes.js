const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');
const { departmentMiddleware } = require('../middleware/departmentMiddleware');

/**
 * @swagger
 * /{id}:
 *   post:
 *     summary: Create treatment record
 *     description: This endpoint allows a doctor to create a new treatment record for a patient.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient whose treatment record is being created
 *         schema:
 *           type: string
 *           example: "P12349"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: "P12349"
 *               patientDetails:
 *                 type: object
 *                 properties:
 *                   firstname:
 *                     type: string
 *                     example: "John"
 *                   lastname:
 *                     type: string
 *                     example: "Doe"
 *                   age:
 *                     type: integer
 *                     example: 45
 *                   department:
 *                     type: string
 *                     example: "Orthopedics"
 *               doctorId:
 *                 type: string
 *                 example: "D5678"
 *               diagnosis:
 *                 type: string
 *                 example: "Fractured hand"
 *               treatmentPlan:
 *                 type: string
 *                 example: "Patient will undergo physiotherapy for eight weeks to regain mobility."
 *               procedures:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Leg Surgery"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T10:00:00Z"
 *                     outcome:
 *                       type: string
 *                       example: "Successful"
 *               progressNotes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     note:
 *                       type: string
 *                       example: "Patient is responding well to treatment."
 *               prescriptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Paracetamol"
 *                     dosage:
 *                       type: string
 *                       example: "500mg"
 *                     frequency:
 *                       type: string
 *                       example: "Twice a day"
 *                     duration:
 *                       type: string
 *                       example: "5 days"
 *               referrals:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     department:
 *                       type: string
 *                       example: "Orthopedics"
 *                     serviceType:
 *                       type: string
 *                       example: "Physiotherapy"
 *                     status:
 *                       type: string
 *                       enum: [SCHEDULED, COMPLETED, PENDING]
 *                       example: "SCHEDULED"
 *                     notes:
 *                       type: string
 *                       example: "Follow-up in 2 weeks."
 *               followUpRequired:
 *                 type: boolean
 *                 example: true
 *               treatmentStatus:
 *                 type: string
 *                 example: "ongoing"
 *               doctorNotes:
 *                 type: string
 *                 example: "Monitor patient for any signs of infection."
 *     responses:
 *       201:
 *         description: Treatment record successfully created
 *       400:
 *         description: Bad request, invalid input data
 *       403:
 *         description: Forbidden, user does not have the required role or permission
 *       500:
 *         description: Internal server error
 */
router.post(
  '/:id',
  verifyToken,
  verifyRole(['doctor']),
  departmentMiddleware(['Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology']),
  treatmentController.createTreatmentRecord
);

/**
 * @swagger
 * /{id}/prescription:
 *   post:
 *     summary: Append prescription plan
 *     description: This endpoint allows a doctor to append a prescription plan to an existing treatment record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient whose prescription is being appended
 *         schema:
 *           type: string
 *           example: "P12349"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *                 example: "Medicine"
 *               serviceType:
 *                 type: string
 *                 example: "Radiology"
 *               notes:
 *                 type: string
 *                 example: "X-Ray required"
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, COMPLETED, PENDING]
 *                 example: "SCHEDULED"
 *     responses:
 *       200:
 *         description: Prescription plan successfully appended
 *       400:
 *         description: Bad request, invalid input data
 *       403:
 *         description: Forbidden, user does not have the required role or permission
 *       404:
 *         description: Treatment record not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/prescription', 
  verifyToken, 
  verifyRole(['doctor']), 
  treatmentController.appendTreatmentPrescription
);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update treatment record
 *     description: This endpoint allows a doctor to update an existing treatment record for a patient.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient whose treatment record is being updated
 *         schema:
 *           type: string
 *           example: "P12349"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               treatmentPlan:
 *                 type: string
 *                 example: "Updated physiotherapy plan: extended to six weeks."
 *               progressNotes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-28T12:30:00.000Z"
 *                     note:
 *                       type: string
 *                       example: "Patient showing improved mobility, recommend additional exercises."
 *               prescriptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Antibiotics"
 *                     dosage:
 *                       type: string
 *                       example: "2000mg"
 *                     frequency:
 *                       type: string
 *                       example: "Twice a day"
 *                     duration:
 *                       type: string
 *                       example: "7 days"
 *               followUpRequired:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Treatment record successfully updated
 *       400:
 *         description: Bad request, invalid input data
 *       403:
 *         description: Forbidden, user does not have the required role or permission
 *       404:
 *         description: Treatment record not found for the given patient ID
 *       500:
 *         description: Internal server error
 */
router.put('/:id',
  verifyToken,
  verifyRole(['doctor','nurse']),
  treatmentController.updateTreatmentRecord
);

/**
 * @swagger
 * /view/{id}:
 *   get:
 *     summary: View treatment record
 *     description: This endpoint allows a doctor or nurse to view a treatment record for a patient.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient whose treatment record is being viewed
 *         schema:
 *           type: string
 *           example: "P12349"
 *     responses:
 *       200:
 *         description: Successfully retrieved treatment record
 *       403:
 *         description: Forbidden, user does not have the required role (doctor or nurse)
 *       404:
 *         description: Treatment record not found for the given patient ID
 *       500:
 *         description: Internal server error
 */
router.get('/view/:id',
  verifyToken,
  verifyRole(['doctor', 'nurse']),
  treatmentController.viewTreatmentRecord
);


/**
* @swagger
* /delete/{id}:
*   delete:
*     summary: Delete treatment record
*     description: This endpoint allows a doctor or nurse to delete a treatment record for a patient.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the patient whose treatment record is being deleted
*         schema:
*           type: string
*           example: "P12349"
*     responses:
*       200:
*         description: Treatment record successfully deleted
*       403:
*         description: Forbidden, user does not have the required role (doctor or nurse)
*       404:
*         description: Treatment record not found for the given patient ID
*       500:
*         description: Internal server error
*/
router.delete('/delete/:id',
  verifyToken,
  verifyRole(['doctor','nurse']),
  treatmentController.deleteTreatmentRecord
);


module.exports = router;