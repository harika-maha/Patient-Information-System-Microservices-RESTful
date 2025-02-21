const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');  // Ensure correct import

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/delete/:id', 
  authMiddleware.verifyToken, 
  verifyRole(['admin']),  // Ensure this function exists and is correctly referenced
  authController.deleteUser
);
router.get('/validate-token', authController.validateToken)


module.exports = router;
