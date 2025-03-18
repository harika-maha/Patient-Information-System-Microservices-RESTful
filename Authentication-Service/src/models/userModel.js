const mongoose = require("mongoose");

const validDepartments = [
  'Medicine',
  'Surgery',
  'Orthopedics',
  'Pediatrics',
  'ENT',
  'Ophthalmology',
  'Gynecology',
  'Dermatology',
  'Oncology'
];

const validRoles = ['admin', 'doctor', 'nurse', 'clerk', 'paramedic'];

const userSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true,
        required: [true, 'Employee ID is required'],
        minlength: [3, 'Employee ID must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: 'Invalid email format'
        }
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [20, 'Username cannot exceed 20 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: validRoles,
        required: [true, 'Role is required']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        maxlength: [30, 'First name cannot exceed 30 characters']
    },
    lastName: {
        type: String,
        maxlength: [30, 'Last name cannot exceed 30 characters']
    },
    department: {
      type: String,
      required: function () {
          return this.role === 'doctor' || this.role === 'nurse';  // ✅ Required for doctor and nurse only
      },
      validate: {
          validator: function (value) {
              // Ensures only valid departments are accepted for doctor and nurse roles
              if (this.role === 'doctor' || this.role === 'nurse') {
                  return validDepartments.includes(value);
              }
              // Ensures no department is assigned for admin, clerk, etc.
              return !value;
          },
          message: function (props) {
              return this.role === 'doctor' || this.role === 'nurse'
                  ? `Invalid department: '${props.value}'. Accepted values: ${validDepartments.join(', ')}`
                  : `Department should not be provided for role: ${this.role}`;
          }
      }
  },
  resetToken: { type: String },
    resetTokenExpires: { type: Date }
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);
