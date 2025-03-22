const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const axios = require('axios');  // Importing axios to stub it

const Treatment = require('../../models/treatmentModel');
const treatmentService = require('../../services/index');
const jwt = require('jsonwebtoken');

// Use require to properly load chai-as-promised
chai.use(require('chai-as-promised'));

describe('Treatment Service - Unit Tests', () => {
    let mockTreatment, invalidTreatment;

    beforeEach(() => {
        console.log("Setting up mock data and stubs...");

        // Stub axios.get() to prevent actual API calls to Patient Service
        sinon.stub(axios, 'get').resolves({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                age: 45
            }
        });

        // Define valid mock treatment data
        mockTreatment = {
            patientId: "P12349",
            patientDetails: {
                firstname: "John",
                lastname: "Doe",
                age: 45,
                department: "Orthopedics"
            },
            doctorId: "D5678",
            diagnosis: "Fractured hand",
            treatmentPlan: "Physiotherapy for eight weeks",
            prescriptions: [
                { name: 'Ibuprofen', dosage: '200mg', frequency: 'Twice a day', duration: '7 days' }
            ],
            treatmentStatus: 'ongoing'
        };

        // Define invalid treatment data (missing required fields)
        invalidTreatment = {
            patientId: "PInvalid",
            doctorId: "D5678",
            treatmentPlan: "Physiotherapy",
        };

        // Stubs
        sinon.stub(Treatment, 'findOne');
        sinon.stub(Treatment.prototype, 'save');
        sinon.stub(Treatment, 'findOneAndDelete');
        sinon.stub(jwt, 'sign').returns('mocked-jwt-token');
        sinon.stub(jwt, 'verify').returns({ id: 'mocked-id', role: 'doctor' });

        console.log("Mocks and stubs set up successfully.");
        console.log("Loaded treatmentService: ", Object.keys(treatmentService));
    });

    afterEach(() => {
        console.log("Restoring original methods...");
        sinon.restore();
    });

    // Test Case 1: Successfully Create a New Treatment Record
    it('should successfully create a new treatment record', async () => {
        console.log("Starting: Create a new treatment record...");
        
        Treatment.findOne.resolves(null);
        Treatment.prototype.save.resolves(mockTreatment);

        const result = await treatmentService.createTreatment(
            mockTreatment.patientId,
            mockTreatment,
            { id: mockTreatment.doctorId, department: "Orthopedics", authHeader: "Bearer fake-token" }
        );

        console.log("Create Treatment Result:", result);
        expect(result).to.be.an('object');
        expect(result).to.have.property('patientId', 'P12349');
        expect(result).to.have.property('treatmentPlan', mockTreatment.treatmentPlan);
    });

    // Test Case 2: Duplicate Treatment Record
    it('should throw an error if treatment record already exists', async () => {
        console.log("Starting: Check duplicate treatment record...");
        
        // Simulate treatment record already exists
        Treatment.findOne.resolves(mockTreatment);

        try {
            await treatmentService.createTreatment(
                mockTreatment.patientId,
                mockTreatment,
                { id: mockTreatment.doctorId, department: "Orthopedics", authHeader: "Bearer fake-token" }
            );
        } catch (error) {
            expect(error.message).to.equal('Treatment record already exists for this patient');
            console.log("Duplicate record test completed.");
        }
    });

    // Test Case 3: Invalid Treatment Data
    it('should throw an error if required fields are missing', async () => {
        console.log("Starting: Check missing required fields...");
        
        Treatment.findOne.resolves(null); // Simulate no existing record

        try {
            await treatmentService.createTreatment(
                invalidTreatment.patientId,
                invalidTreatment,
                { id: invalidTreatment.doctorId, department: "Orthopedics", authHeader: "Bearer fake-token" }
            );
        } catch (error) {
            expect(error.message).to.equal('Missing required treatment details');
            console.log("Invalid data test completed.");
        }
    });

    // Test Case 4: Successful Treatment Update
    it('should successfully update a treatment record', async () => {
        console.log("Starting: Update a treatment record...");
        
        const updatedTreatmentData = { treatmentPlan: 'Updated treatment plan' };
        const mockTreatmentInstance = { 
            ...mockTreatment,
            save: sinon.stub().resolves(updatedTreatmentData)
        };

        Treatment.findOne.resolves(mockTreatmentInstance);

        const result = await treatmentService.updateTreatment(
            mockTreatment.patientId,
            updatedTreatmentData,
            mockTreatment.doctorId
        );

        console.log("Update Treatment Result:", result);
        expect(result).to.have.property('treatmentPlan', updatedTreatmentData.treatmentPlan);
    });
});