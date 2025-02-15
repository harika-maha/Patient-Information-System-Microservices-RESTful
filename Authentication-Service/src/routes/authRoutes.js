const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');  // Ensure correct import
const { departmentMiddleware } = require('../middleware/departmentMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/delete/:id', 
  authMiddleware.verifyToken, 
  verifyRole(['admin']),  // Ensure this function exists and is correctly referenced
  authController.deleteUser
);


module.exports = router;
