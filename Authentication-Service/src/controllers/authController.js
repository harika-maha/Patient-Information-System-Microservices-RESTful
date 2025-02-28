
const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
      const user = await authService.registerUser(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const loginResponse = await authService.loginUser(email, password);
      res.json(loginResponse);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  exports.validateToken = async (req, res) => {
    try {
      const token = req.header('Authorization')?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Access denied: No token provided' });
      }
      const user = await authService.validateToken(token);
      res.json({ user });
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const requestingUser = req.user;
  
      const deletedUser = await authService.deleteUser(id);
      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  