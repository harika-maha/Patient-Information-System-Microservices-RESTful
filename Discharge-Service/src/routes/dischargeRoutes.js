const express = require('express');
const router = express.Router();
const dischargeController = require('../controllers/dischargeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');
const { departmentMiddleware } = require('../middleware/departmentMiddleware');

/**
 * @swagger
 * /{id}:
 *   post:
 *     summary: Create discharge summary
 *     description: This endpoint creates a discharge summary for a patient.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient
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
 *               homeCarePlan:
 *                 type: string
 *                 example: "Rest for 2 weeks, follow up in OPD after 10 days"
 *               medications:
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
 *                       example: "3 times a day"
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
 *                     notes:
 *                       type: string
 *                       example: "Need physiotherapy sessions"
 *     responses:
 *       201:
 *         description: Discharge summary successfully created
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
  dischargeController.createSummary
);


/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update discharge summary
 *     description: This endpoint updates an existing discharge summary for a patient.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient
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
 *               homeCarePlan:
 *                 type: string
 *                 example: "Updated care plan"
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Aspirin"
 *                     dosage:
 *                       type: string
 *                       example: "200mg"
 *                     frequency:
 *                       type: string
 *                       example: "2 times a day"
 *     responses:
 *       200:
 *         description: Discharge summary successfully updated
 *       400:
 *         description: Bad request, invalid input data
 *       404:
 *         description: Discharge summary not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id',
  verifyToken,
  verifyRole(['doctor']),
  dischargeController.updateSummary
 );
 
 /**
 * @swagger
 * /view/{id}:
 *   get:
 *     summary: View discharge summary
 *     description: This endpoint allows a doctor or nurse to view the discharge summary for a patient.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient whose discharge summary is being viewed
 *         schema:
 *           type: string
 *           example: "P0012"
 *     responses:
 *       200:
 *         description: Successfully retrieved discharge summary
 *       403:
 *         description: Forbidden, user does not have the required role (doctor or nurse)
 *       404:
 *         description: Discharge summary not found for the given patient ID
 *       500:
 *         description: Internal server error
 */
 router.get('/view/:id',
  verifyToken,
  verifyRole(['doctor', 'nurse']),
  dischargeController.viewSummary
 );
 
 /**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete discharge summary
 *     description: This endpoint allows a doctor to delete the discharge summary for a patient.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient whose discharge summary is being deleted
 *         schema:
 *           type: string
 *           example: "P0012"
 *     responses:
 *       200:
 *         description: Discharge summary successfully deleted
 *       403:
 *         description: Forbidden, user does not have the required role (doctor)
 *       404:
 *         description: Discharge summary not found for the given patient ID
 *       500:
 *         description: Internal server error
 */
 router.delete('/delete/:id',
  verifyToken,
  verifyRole(['doctor']),
  dischargeController.deleteSummary
 );

 /**
 * @swagger
 * /{id}/referral:
 *   post:
 *     summary: Append referral to discharge summary
 *     description: This endpoint allows a doctor to append a referral to an existing discharge summary for a patient.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient whose referral is being added
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
 *         description: Referral successfully appended to discharge summary
 *       400:
 *         description: Bad request, invalid input data
 *       403:
 *         description: Forbidden, user does not have the required role or permission
 *       404:
 *         description: Discharge summary not found
 *       500:
 *         description: Internal server error
 */

 router.post('/:id/referral', 
  verifyToken, 
  verifyRole(['doctor']), 
  dischargeController.appendSummaryReferral
);

/**
 * @swagger
 * /{id}/signoff:
 *   put:
 *     summary: Sign off discharge summary
 *     description: This endpoint allows a doctor to sign off a discharge summary for a patient.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient whose discharge summary is being signed off
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
 *               patientId:
 *                 type: string
 *                 example: "P0012"
 *               userId:
 *                 type: string
 *                 example: "doctor123"
 *     responses:
 *       200:
 *         description: Discharge summary successfully signed off
 *       400:
 *         description: Bad request, invalid input data
 *       403:
 *         description: Forbidden, user does not have the required role or permission
 *       404:
 *         description: Discharge summary or patient not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/signoff',
  verifyToken,
  verifyRole(['doctor']),
  dischargeController.signOffSummary
);

module.exports = router;