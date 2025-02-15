const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const departmentMiddleware = require('../middlewares/departmentMiddleware');

const router = express.Router();

// Test Auth Route
router.get('/test-auth', authMiddleware.verifyToken, (request, response) => {
  res.json({ message: 'JWT Authentication Successful', user: req.user });
});

// Role-based route
router.get('/admin', authMiddleware.verifyToken, roleMiddleware.verifyRole(['Admin']), (request, response) => {
  res.json({ message: 'Admin Access Granted' });
});

// Department-based route
router.get('/surgery', authMiddleware.verifyToken, departmentMiddleware.verifyDepartment(['Surgery']), (req, res) => {
    res.json({ message: 'Surgery Department Access Granted' });
  });

module.exports = router;
