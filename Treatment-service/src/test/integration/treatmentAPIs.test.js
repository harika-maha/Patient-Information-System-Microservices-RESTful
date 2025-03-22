const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const axios = require('axios');
const { expect } = chai;
const mongoose = require('mongoose');
const express = require('express');
const Treatment = require('../../models/treatmentModel');
const treatmentController = require('../../controllers/treatmentController');

chai.use(chaiHttp);

// Mock app bypassing middleware for testing
const createTestApp = () => {
    const testApp = express();
    testApp.use(express.json());

    // Mock user object
    testApp.use((req, res, next) => {
        req.user = { id: 'D5678', department: 'Orthopedics', authHeader: "Bearer fake-token" };
        next();
    });

    // Routes without middleware
    testApp.post('/api/treatment/:id', (req, res) => {
        treatmentController.createTreatmentRecord(req, res);
    });

    testApp.get('/api/treatment/:id', (req, res) => {
        treatmentController.viewTreatmentRecord(req, res);
    });

    testApp.put('/api/treatment/:id', (req, res) => {
        treatmentController.updateTreatmentRecord(req, res);
    });

    testApp.delete('/api/treatment/:id', (req, res) => {
        treatmentController.deleteTreatmentRecord(req, res);
    });

    return testApp;
};

describe('Treatment Service - Integration Tests', function () {
    let testApp;

    before(async function () {

        process.env.JWT_SECRET = '5dfed57f915dd0bc3b87ea0c3db3c562aa2a69c27e9007d630a008deac56a7ceS';
        process.env.URI = 'mongodb+srv://harika:harika123@cluster0.ddgyc.mongodb.net/TreatmentTestDB?retryWrites=true&w=majority&appName=Cluster0';
        process.env.PORT=3004

        console.log('Connecting to Test Database...');
        await mongoose.connect(process.env.URI);
        testApp = createTestApp();
        console.log('Connected to Test Database and cleared Treatment collection.');
        await Treatment.deleteMany({});

        // Stub axios to mock patient data retrieval
        sinon.stub(axios, 'get').resolves({
            data: { firstName: 'John', lastName: 'Doe', age: 45 }
        });
    });

    after(async function () {
        console.log('Cleaning up and closing connection...');
        await Treatment.deleteMany({});
        await mongoose.connection.close();
        sinon.restore();
        console.log('Cleanup complete and connection closed.');
    });

    // Test: Create a New Treatment
    it('should create a new treatment record successfully', async function () {
        console.log("Starting: Create a new treatment record...");
        const res = await chai.request(testApp)
            .post('/api/treatment/T001')
            .send({
                diagnosis: "Fractured hand",
                treatmentPlan: "Physiotherapy for eight weeks",
                prescriptions: [{ name: 'Ibuprofen', dosage: '200mg', frequency: 'Twice a day', duration: '7 days' }]
            });

        console.log("Create Treatment Response Status:", res.status);
        console.log("Create Treatment Response Body:", res.body);

        expect(res).to.have.status(201);
    });

    // Test: Retrieve Treatment Record
    it('should retrieve a treatment record successfully', async function () {
        console.log("Starting: Retrieve a treatment record...");
        const res = await chai.request(testApp)
            .get('/api/treatment/T001');

        console.log("Retrieve Treatment Response Status:", res.status);
        console.log("Retrieve Treatment Response Body:", res.body);

        expect(res).to.have.status(200);
    });

    // Test: Update Treatment Record
    it('should update treatment record successfully', async function () {
        console.log("Starting: Update a treatment record...");
        const res = await chai.request(testApp)
            .put('/api/treatment/T001')
            .send({ treatmentPlan: 'Updated treatment plan' });

        console.log("Update Treatment Response Status:", res.status);
        console.log("Update Treatment Response Body:", res.body);

        expect(res).to.have.status(200);
    });

    // Test: Delete Treatment Record
    it('should delete a treatment record successfully', async function () {
        console.log("Starting: Delete a treatment record...");
        const res = await chai.request(testApp)
            .delete('/api/treatment/T001');

        console.log("Delete Treatment Response Status:", res.status);
        console.log("Delete Treatment Response Body:", res.body);

        expect(res).to.have.status(200);
    });
});