const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const Patient = require('../../models/patientModel');
const patientController = require('../../controllers/patientController');

chai.use(chaiHttp);

// Mock app bypassing middleware for testing
const createTestApp = () => {
    const testApp = express();
    testApp.use(express.json());

    // Routes without middleware
    testApp.post('/api/patient/register', (req, res) => {
        patientController.registerPatient(req, res);
    });

    testApp.get('/api/patient/all', (req, res) => {
        patientController.getAllPatients(req, res);
    });

    testApp.get('/api/patient/:patientId', (req, res) => {
        patientController.getPatientById(req, res);
    });

    testApp.put('/api/patient/update/:patientId', (req, res) => {
        patientController.updatePatientDetails(req, res);
    });

    testApp.delete('/api/patient/delete/:patientId', (req, res) => {
        req.user = { id: 'ADMIN001', role: 'admin' }; // Mock admin privileges
        patientController.deletePatient(req, res);
    });

    return testApp;
};

// Test Suite
describe('Patient Registration Service - Integration Tests', function () {
    let testApp;

    before(async function () {
        process.env.JWT_SECRET = '5dfed57f915dd0bc3b87ea0c3db3c562aa2a69c27e9007d630a008deac56a7ceS';
        process.env.URI = 'mongodb+srv://harika:harika123@cluster0.ddgyc.mongodb.net/PatientsTestDB?retryWrites=true&w=majority&appName=Cluster0';
        process.env.PORT=3002

        await mongoose.connect(process.env.URI);
        testApp = createTestApp();
        await Patient.deleteMany({});
    });

    after(async function () {
        await Patient.deleteMany({});
        await mongoose.connection.close();
    });

    // Test: Register a New Patient
    it('should register a new patient successfully', async function () {
        const patientData = {
            patientId: 'P0090',
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            gender: 'Male',
            department: 'Medicine',
            contactNumber: '9712232323',
            address: '123 Main Street',
            medicalHistory: ['Asthma'],
            complaints: ['Fever']
        };

        const res = await chai.request(testApp)
            .post('/api/patient/register')
            .send(patientData);

        expect(res).to.have.status(201);
        expect(res.body.patient).to.have.property('firstName', 'John');
    });

    // Test: Register Duplicate Patient
    it('should fail to register if the patient ID already exists', async function () {
        const duplicatePatientData = {
            patientId: 'P0090',
            firstName: 'Duplicate',
            lastName: 'User',
            age: 35,
            gender: 'Female',
            department: 'Pediatrics',
            contactNumber: '9712232323',
            address: '456 Main Road',
            medicalHistory: ['Allergy'],
            complaints: ['Cough']
        };

        const res = await chai.request(testApp)
            .post('/api/patient/register')
            .send(duplicatePatientData);

        expect(res).to.have.status(409);
        expect(res.body).to.have.property('error', 'Patient ID already exists');
    });

    // Test: Retrieve All Patients
    it('should return all registered patients', async function () {
        const res = await chai.request(testApp)
            .get('/api/patient/all');

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
    });

    // Test: Retrieve Patient by ID
    it('should return a patient by ID', async function () {
        const res = await chai.request(testApp)
            .get('/api/patient/P0090');

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('patientId', 'P0090');
        expect(res.body).to.have.property('firstName', 'John');
    });

    // Test: Retrieve Non-Existent Patient by ID
    it('should return 400 for non-existent patient', async function () {
        const res = await chai.request(testApp)
            .get('/api/patient/nonexistent');

        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message', 'Patient Not Found');
    });

    // Test: Update Patient Details
    it('should update patient details successfully', async function () {
        const updatedData = {
            firstName: 'Johnny',
            lastName: 'Updated'
        };

        const res = await chai.request(testApp)
            .put('/api/patient/update/P0090')
            .send(updatedData);

        expect(res).to.have.status(200);
    });


});
