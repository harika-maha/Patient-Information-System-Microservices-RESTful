const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
const mongoose = require('mongoose')
const express = require('express')
const sinon = require('sinon')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/userModel')
const authController = require('../../controllers/authController')

chai.use(chaiHttp)

// A test app bypassing middleware
const createTestApp = () => {
    const testApp = express()
    testApp.use(express.json())

    //  Register Route (Bypasses Middleware)
    testApp.post('/api/auth/register', (req, res) => {
        authController.register(req, res)
    })

    //  Login Route (Bypasses Middleware)
    testApp.post('/api/auth/login', (req, res) => {
        authController.login(req, res)
    })

    // Token Validation Route (Bypasses Middleware)
    testApp.get('/api/auth/validate-token', (req, res) => {
        authController.validateToken(req, res)
    })

    // Delete User Route (Bypasses Middleware)
    testApp.delete('/api/auth/delete/:employeeId', (req, res) => {
        req.user = { id: 'ADMIN001', role: 'admin' }
        authController.deleteUser(req, res)
    })

    return testApp
}

// Tests
describe('Authentication API Integration Tests', function () {
    let testApp
    let testUserId

    before(async function () {
        process.env.JWT_SECRET='5dfed57f915dd0bc3b87ea0c3db3c562aa2a69c27e9007d630a008deac56a7ceS'
        process.env.MONGODB_URI = 'mongodb+srv://harika:harika123@cluster0.ddgyc.mongodb.net/AuthenticationDBTest?retryWrites=true&w=majority&appName=Cluster0'
        await mongoose.connect(process.env.MONGODB_URI)
        testApp = createTestApp()
        await User.deleteMany({})
        
    })

    after(async function () {
        await User.deleteMany({})
        await mongoose.connection.close()
    })




    // Test: Register a New User
    it('should register a new user successfully', async function () {
        const sampleUserData = {
             
                "employeeId":"testadmin1",
                "username":"testadmin",
                "email":"testadmin@gmail.com",
                "password":"admin@123",
                "role":"admin",
                "firstName":"Melly",
                "lastName":"Joseph"
        
            
        }

        const res = await chai.request(testApp)
            .post('/api/auth/register')
            .send(sampleUserData)

        expect(res).to.have.status(201)
        expect(res.body.user).to.have.property('email', sampleUserData.email)
    })

    //Test: Register with Existing Email
    it('should fail to register if the email already exists', async function () {
        const sampleUserData = {
             
            "employeeId":"testadmin1",
            "username":"testadmin",
            "email":"testadmin@gmail.com",
            "password":"admin@123",
            "role":"admin",
            "firstName":"Melly",
            "lastName":"Joseph"
    
        
    }
        const res = await chai.request(testApp)
            .post('/api/auth/register')
            .send(sampleUserData)

        expect(res).to.have.status(400)
        expect(res.body).to.have.property('error', 'Email already exists')
    })

    //  Test: Successful Login
    it('should login a user successfully', async function () {
        const res = await chai.request(testApp)
            .post('/api/auth/login')
            .send({
                email: 'testadmin@gmail.com',
                password: 'admin@123'
            })

        expect(res).to.have.status(200)
        expect(res.body).to.have.property('token')
    })

    //  Test: Invalid Login Credentials
    it('should fail login with incorrect credentials', async function () {
        const res = await chai.request(testApp)
            .post('/api/auth/login')
            .send({
                email: 'wronguser@example.com',
                password: 'wrongpassword'
            })

        expect(res).to.have.status(401)
        expect(res.body).to.have.property('error', 'Invalid credentials')
    })

    // Test: Validate Token
    it('should validate a valid token', async function () {
        const token = jwt.sign({ id: 'abc123' }, process.env.JWT_SECRET, { expiresIn: '1h' })

        const res = await chai.request(testApp)
            .get('/api/auth/validate-token')
            .set('Authorization', `Bearer ${token}`)

        expect(res).to.have.status(200)
        expect(res.body.user).to.have.property('id', res.body.user.id)
    })

    //Test: Validate Invalid Token
    it('should fail token validation with invalid token', async function () {
        const res = await chai.request(testApp)
            .get('/api/auth/validate-token')
            .set('Authorization', 'Bearer invalid-token')

        expect(res).to.have.status(401)
        expect(res.body).to.have.property('error', 'Invalid or expired token')
    })

    // Test: Delete a User
    it('should delete a user successfully', async function () {
        const token = jwt.sign({ id: 'abc123',role:'admin', department: ''}, process.env.JWT_SECRET, { expiresIn: '1h' })
        const res = await chai.request(testApp)
            .delete(`/api/auth/delete/testadmin1`)
            .set('Authorization', token)

        expect(res).to.have.status(200)
        expect(res.body).to.have.property('message', 'User deleted successfully')
    })

    // Test: Delete Non-existent User
    it('should return 400 for deleting a non-existent user', async function () {
        const token = jwt.sign({ id: 'abc123',role:'admin', department: ''}, process.env.JWT_SECRET, { expiresIn: '1h' })
        const res = await chai.request(testApp)
            .delete(`/api/auth/delete/nonExistentUser`)
            .set('Authorization',token)

        expect(res).to.have.status(400)
        expect(res.body).to.have.property('error', 'User not found')
    })
})
