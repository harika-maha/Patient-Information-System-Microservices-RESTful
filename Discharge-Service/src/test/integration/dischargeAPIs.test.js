const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
const mongoose = require('mongoose')
const express = require('express')
const Discharge = require('../../models/dischargeModel')
const dischargeController = require('../../controllers/dischargeController')
const axios = require('axios')
const sinon = require('sinon')

chai.use(chaiHttp)

const originalGetPatientDetails = require('../../services/createService').getPatientDetails

// A test app bypassing the middleware
const createTestApp = () => {
  const testApp = express()
  testApp.use(express.json())
  
  // routes without middleware auth
  testApp.get('/api/discharge/view/:id', (req, res) => {
    dischargeController.viewSummary(req, res)
  })
  testApp.post('/api/discharge/:id', (req, res) => {
    req.user = { id: 'D789012', department: 'Medicine' }
    req.headers = { authorization: 'Bearer fake-token' }
    dischargeController.createSummary(req, res)
  })
  testApp.put('/api/discharge/:id', (req, res) => {
    req.user = { id: 'D789012' }
    dischargeController.updateSummary(req, res)
  })
  testApp.delete('/api/discharge/delete/:id', (req, res) => {
    req.user = { id: 'D789012' }
    dischargeController.deleteSummary(req, res)
  })
  testApp.post('/api/discharge/:id/referral', (req, res) => {
    req.user = { id: 'D789012' }
    dischargeController.appendSummaryReferral(req, res)
  })
  testApp.put('/api/discharge/:id/signoff', (req, res) => {
    req.user = { id: 'D789012' }
    dischargeController.signOffSummary(req, res)
  })
  return testApp
}
//tests
describe('Discharge API Integration Tests', function() {
  let testApp
  let testPatientId = 'P123456'
  let axiosStub

//function to create test summary, default values are set, that can be customized too
const createTestSummary = async (customData = {}) => {
    const defaultData = {
      patientId: testPatientId,
      patientDetails: {
        firstname: 'John',
        lastname: 'Doe',
        age: 45,
        department: 'Medicine'
      },
      doctorId: 'D789012',
      homeCarePlan: 'Care plan',
      medications: [],
      referrals: [],
      status: 'draft'
    }
    const mergedData = {
      ...defaultData,
      ...customData,
      patientDetails: {
        ...defaultData.patientDetails,
        ...(customData.patientDetails || {})
      }
    }
    const testSummary = new Discharge(mergedData)
    await testSummary.save()
    return testSummary
  }

  before(async function() {
    //test DB setup
    process.env.MONGODB_URI = 'mongodb+srv://harika:harika123@cluster0.ddgyc.mongodb.net/DischargeDBTest?retryWrites=true&w=majority&appName=Cluster0'
    await mongoose.connect(process.env.MONGODB_URI)
    testApp = createTestApp()
    
    //patient service mock so the API isn't directly called for that service
    require('../../services/createService').getPatientDetails = async () => {
      return {
        firstName: 'John',
        lastName: 'Doe',
        age: 45
      }
    }
  })
  after(async function() {
    require('../../services/createService').getPatientDetails = originalGetPatientDetails
    await Discharge.deleteMany({}) //deletes all records
    await mongoose.connection.close()  //closes mongodb connection
  })
  
  beforeEach(async function() {
    await Discharge.deleteMany({})
    axiosStub = sinon.stub(axios, 'get').resolves({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          age: 45,
          gender: 'Male',
          department: 'Medicine'
        }
      })
  })
  afterEach(function() {
    axiosStub.restore()
  })
  // Test for create API
  it('should create a new discharge summary', async function() {
    const summaryData = {
      homeCarePlan: 'Rest and hydration',
      medications: [{ name: 'Ibuprofen', dosage: '400mg', frequency: 'twice daily' }]
    };
    const res = await chai.request(testApp)
      .post(`/api/discharge/${testPatientId}`)
      .send(summaryData);
    
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('patientId', testPatientId);
    expect(res.body).to.have.property('homeCarePlan', 'Rest and hydration');
  });
  // Test for view API
  it('should retrieve a discharge summary by patient ID', async function() {
    await createTestSummary({
      medications: [{ name: 'Paracetamol', dosage: '500mg', frequency: '3 times a day' }]
    })
    
    const res = await chai.request(testApp)
      .get(`/api/discharge/view/${testPatientId}`)
      
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body[0]).to.have.property('patientId', testPatientId)
  })
  
  // Test for update API
  it('should update an existing discharge summary', async function() {
    await createTestSummary({ homeCarePlan: 'Original care plan' })
    
    const updateData = { homeCarePlan: 'Updated care plan' }
    const res = await chai.request(testApp)
      .put(`/api/discharge/${testPatientId}`)
      .send(updateData)
      
    expect(res).to.have.status(200)
    expect(res.body).to.have.property('homeCarePlan', 'Updated care plan')
  })
  
  // Test for delete API
  it('should delete a discharge summary', async function() {
    await createTestSummary()
    
    const res = await chai.request(testApp)
      .delete(`/api/discharge/delete/${testPatientId}`)
      
    expect(res).to.have.status(200)
    expect(res.body).to.have.property('message', 'Discharge summary deleted successfully')
    
    const found = await Discharge.findOne({ patientId: testPatientId })
    expect(found).to.be.null
  })
  
  // Test for append API
  it('should add a referral to a discharge summary', async function() {
    await createTestSummary()
    
    const referralData = {
      department: 'Orthopedics',
      serviceType: 'Physiotherapy',
      notes: 'Follow-up needed',
      status: 'SCHEDULED'
    }
    
    const res = await chai.request(testApp)
      .post(`/api/discharge/${testPatientId}/referral`)
      .send(referralData)
    
    expect(res).to.have.status(200)
    expect(res.body.referrals).to.have.lengthOf(1)
    expect(res.body.referrals[0].department).to.equal('Orthopedics')
  })
  
  // Test for sign off API
  it('should sign off a discharge summary', async function() {
    await createTestSummary()
    
    const res = await chai.request(testApp)
      .put(`/api/discharge/${testPatientId}/signoff`)
      
    expect(res).to.have.status(200)
    expect(res.body).to.have.property('status', 'signed')
  })
})