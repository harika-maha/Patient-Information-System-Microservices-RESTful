const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');  // Ensure correct import

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with details such as employee ID, email, username, etc.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "EMP00123"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *               role:
 *                 type: string
 *                 example: "admin"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               department:
 *                 type: string
 *                 example: "Medicine"
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Bad request, validation failed
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     description: Logs in a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: User successfully logged in and token generated
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

router.post('/login', authController.login);



/**
 * @swagger
 * /allUsers:
 *   get:
 *     summary: Get all users
 *     description: This endpoint fetches all users, only accessible by an admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden, user does not have access
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
router.get('/allUsers', authMiddleware.verifyToken, 
  verifyRole(['admin']), authController.all);


  /**
 * @swagger
 * /deleteUser/{employeeId}:
 *   delete:
 *     summary: Delete a user by employee ID
 *     description: This endpoint allows an admin to delete a user by their employee ID.
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         description: The employee ID of the user to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden, user does not have access
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
router.delete('/deleteUser/:employeeId', 
  authMiddleware.verifyToken, 
  verifyRole(['admin']),  // Ensure this function exists and is correctly referenced
  authController.deleteUser
);



/**
 * @swagger
 * /validate-token:
 *   get:
 *     summary: Validate a user's token
 *     description: This endpoint validates the user's token and returns its status.
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Unauthorized, token is invalid or expired
 */
router.get('/validate-token', authController.validateToken)


/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     description: This endpoint allows a user to request a password reset link by providing their email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       400:
 *         description: Invalid email address or user not found
 *       500:
 *         description: Internal server error
 */

router.post('/forgot-password', authController.forgotPassword);


/**
 * @swagger
 * /reset-password/{resetToken}:
 *   post:
 *     summary: Reset a user's password
 *     description: This endpoint allows a user to reset their password using a reset token.
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         description: The password reset token
 *         schema:
 *           type: string
 *           example: "abc123xyz"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "bhagy1234"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "bhagy1234"
 *     responses:
 *       200:
 *         description: Password successfully reset
 *       400:
 *         description: Invalid token, passwords don't match, or other validation errors
 *       404:
 *         description: Token not found or expired
 *       500:
 *         description: Internal server error
 */
router.post('/reset-password/:resetToken', authController.resetPassword);


module.exports = router;
