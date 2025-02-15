const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.registerUser = async ({ employeeId,email,username, password, role,firstName,lastName,department }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ employeeId,email,username, password: hashedPassword, role,firstName,lastName, department });
  await user.save();
  return { id: user._id,employeeId:user.empoyeeId, email: user.email,username:user.username,firstName:user.firstName,lastname:user.lastName, role: user.role };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, department: user.department},
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, role: user.role, department: user.department };
};

exports.deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  return user;
};