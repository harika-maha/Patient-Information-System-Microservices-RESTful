const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

const Patient = require('../../models/patientModel');
const patientService = require('../../services/patientService');
const EmailValidator = require('../../utils/emailValidator');

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Patient Registration Service - Unit Tests', () => {
    let mockPatient;

    let invalidPatient;

    beforeEach(() => {
        mockPatient={patientId: "PTest1",
            firstName: "Chali",
            lastName: "Chek",
            age: 22,
            gender: "Female",
            contactNumber: "9712232323",
            department:"Orthopedics",
            address: "123 Main Street, Dubai, UAE",
            medicalHistory: ["Diabetes", "Hypertension"],
            complaints:["headAche"]
        };

        invalidPatient={patientId: "PTest2",
            firstName: "Chali",
            lastName: "Chek",
            age: 22,
            gender: "Female",
            contactNumber: "9712232325",
            department:"Orthopedics",
            address: "123 Main Street, Dubai, UAE",
            medicalHistory: ["Diabetes", "Hypertension"],
            complaints:["headAche"]
        };


        sinon.stub(Patient, 'findOne');
        sinon.stub(Patient.prototype, 'save');
        sinon.stub(Patient, 'findOneAndDelete');
        sinon.stub(EmailValidator, 'validateEmail').returns(true);
        sinon.stub(bcrypt, 'hash').resolves('hashedpassword');
        sinon.stub(bcrypt, 'compare').resolves(true);
        sinon.stub(jwt, 'sign').returns('mocked-jwt-token');
        sinon.stub(jwt, 'verify').returns({ id: 'mocked-id', role: 'admin' });
    });

    afterEach(() => {
        sinon.restore();
    });

    // Test Case 1: Successful Patient Registration
    it('should register a new patient successfully', async () => {
        Patient.findOne.resolves(null); // Ensure no duplicate
       
        const result = await patientService.createPatient(mockPatient);

        expect(result).to.be.an('object');
        expect(result).to.have.property('patientId', 'PTest1');
        expect(result).to.have.property('firstName', 'Chali');
    });

    // Test Case 2: Duplicate Patient ID Error
    it('should throw an error if patient ID already exists', async () => {

        Patient.findOne.resolves(mockPatient);

        await expect(patientService.createPatient({mockPatient}))
            .to.be.rejectedWith('Error: patientId already exists');
    });

    // Test Case 3: Invalid Contact Number
    it('should throw an error for invalid contact number', async () => {
        await expect(patientService.createPatient({
            ...invalidPatient,
            contactNumber: '12345' // Invalid number
        })).to.be.rejectedWith('Error: Contact number must be exactly 10 digits');
    });

    // Test Case 4: Add Invalid Department
    it('should throw an error if department is invalid', async () => {
        await expect(patientService.createPatient({
            ...invalidPatient,
            contactNumber:'9712232325',
            department: 'UnknownDepartment'
        })).to.be.rejectedWith('Invalid department. Allowed values are: Medicine, Surgery, Orthopedics, Pediatrics, ENT, Ophthalmology, Gynecology, Dermatology, Oncology');
    });

    
});


