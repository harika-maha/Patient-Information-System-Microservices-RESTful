
const jwt=require('jsonwebtoken')

exports.verifyToken = (request, response, next) => {
    const authorizationHeader = request.header('Authorization');
    if (!authorizationHeader) {
      return response.status(401).json({ message: 'No valid token provided: Access dinied' });
    }
  
    const token = authorizationHeader.startsWith("Bearer") 
      ? authorizationHeader.split(" ")[1] 
      : authorizationHeader;
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      request.user = verified;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired. Please log in again." });
      }
      return response.status(400).json({ message: "Invalid token provided" });
    }
  };