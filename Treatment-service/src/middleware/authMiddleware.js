const axios = require('axios');

exports.verifyToken = async (req, res, next) => {
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
  } catch (error) {
    console.error('Full error:', error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return res.status(401).json({ message: 'Token expired or invalid' });
        case 403:
          return res.status(403).json({ message: 'Access forbidden' });
        default:
          return res.status(500).json({ message: 'Authentication service error' });
      }
    }
    
    console.error('Token validation error:', error.message);
    res.status(500).json({ message: 'Error validating authentication' });
  }
};