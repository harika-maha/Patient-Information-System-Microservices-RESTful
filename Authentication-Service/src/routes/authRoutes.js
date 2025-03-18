const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');  // Ensure correct import

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/allUsers', authMiddleware.verifyToken, 
  verifyRole(['admin']), authController.all);
router.delete('/deleteUser/:employeeId', 
  authMiddleware.verifyToken, 
  verifyRole(['admin']),  // Ensure this function exists and is correctly referenced
  authController.deleteUser
);
router.get('/validate-token', authController.validateToken)

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:resetToken', authController.resetPassword);


module.exports = router;
