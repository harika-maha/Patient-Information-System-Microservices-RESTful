const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Test Auth Route
router.get('/test-auth', authMiddleware.verifyToken, (request, response) => {
  res.json({ message: 'JWT Authentication Successful', user: req.user });
});

// Role-based route
router.get('/admin', authMiddleware.verifyToken, roleMiddleware.verifyRole(['Admin']), (request, response) => {
  res.json({ message: 'Admin Access Granted' });
});


module.exports = router;
