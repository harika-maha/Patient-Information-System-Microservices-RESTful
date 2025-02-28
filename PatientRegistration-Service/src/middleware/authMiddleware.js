const axios=require('axios')
const patientAuthMiddleware = require('express').Router();


patientAuthMiddleware.verifyToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Access denied: No token provided' });
    }

    const token = authorizationHeader.startsWith('Bearer ')
      ? authorizationHeader.split(' ')[1]
      : authorizationHeader;

    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/validate-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    req.user = response.data.user;
    next();
  } 
  catch (err) {
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ message: 'Access denied: Token expired' });
    }
    console.error('Token validation failed:', err.message || err);
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = patientAuthMiddleware;