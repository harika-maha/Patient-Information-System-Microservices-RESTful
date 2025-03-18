
const authService = require('../services/authService');
const nodemailer = require('nodemailer');
const User=require('../models/userModel')
const crypto = require('crypto');
const { request } = require('http');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
      const user = await authService.registerUser(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.all = async (req, res) => {
    try {
      const users = await authService.getAllUsers();
      res.status(201).json({ message: 'User List retrieved successfully', users });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const loginResponse = await authService.loginUser(email, password);
      res.json(loginResponse);
    } catch (error) {
      res.status(401).json({ error: error.message });
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
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const requestingUser = req.user;
  
      const deletedUser = await authService.deleteUser(employeeId);
      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.resetPassword = async (req, res) => {
    const{resetToken}=req.params;
    const {newPassword,confirmPassword } = req.body;

    try {
       
      if (!newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'Both password fields are required' });
      }
       if(newPassword!=confirmPassword){
        return res.status(400).json({ error: 'new password and confirm password not matching' });
       }
        const user = await User.findOne({
            resetToken: resetToken,
            resetTokenExpires: { $gt: Date.now() } // Token must be valid
        });

        if (!user) {

          return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined; // Clear token after use
        user.resetTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset password' });
    }
  };

  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Send reset link via email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: '"Prime Medicare" <noreply@hospital.com>',
            to: user.email,
            subject: 'Password Reset Request',
            text: `Hello ${user.username},\n\n
                   Please click the link below to reset your password:
                   ${process.env.AUTH_URL}/reset-password/${resetToken}\n\n
                   If you did not request this, please ignore this email.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({  message: `Reset password link generated successfully.`,
          resetToken: `${resetToken}`});
    } catch (error) {
        res.status(500).json({ error: 'Failed to send password reset link' });
    }
  };

  