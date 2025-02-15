
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
  