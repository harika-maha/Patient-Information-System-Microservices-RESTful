const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const EmailValidator = require('../utils/emailValidator');
exports.registerUser = async ({ employeeId,email,username, password, role,firstName,lastName,department }) => {
  if (!EmailValidator.validateEmail(email)) {
    throw new Error('Invalid email format');
}
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ employeeId,email,username, password: hashedPassword, role,firstName,lastName, department });
  await user.save();
  return { id: user._id,employeeId:user.empoyeeId, email: user.email,username:user.username,firstName:user.firstName,lastname:user.lastName, role: user.role };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
 
  if(!user || !await bcrypt.compare(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, department: user.department},
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, role: user.role};
};

exports.getAllUsers = async () => {
  const users = await User.find();
 
  return { users};
};

exports.validateToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.deleteUser = async (employeeId) => {
  const user = await User.findOneAndDelete(employeeId);
  if (!user) throw new Error('User not found');
  return user;
};