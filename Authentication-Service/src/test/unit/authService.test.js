const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

const User = require('../../models/userModel');
const authService = require('../../services/authService');
const EmailValidator = require('../../utils/emailValidator');

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Register user Test', () => {

    // Mock User Model
    beforeEach(() => {
        sinon.stub(User, 'findOne');
        sinon.stub(User.prototype, 'save');
        sinon.stub(User, 'findOneAndDelete');
        sinon.stub(EmailValidator, 'validateEmail').returns(true);
        sinon.stub(bcrypt, 'hash').resolves('hashedpassword');
        sinon.stub(bcrypt, 'compare').resolves(true);
        sinon.stub(jwt, 'sign').returns('mocked-jwt-token');
        sinon.stub(jwt, 'verify').returns({ id: 'mocked-id', role: 'admin' });
    });

    afterEach(() => {
        sinon.restore();
    });

    //Test Case 1: Successful User Registration
    it('should register a new user successfully', async () => {
        User.findOne.resolves(null);

        const result = await authService.registerUser({
            employeeId: 'Emp01',
            email: 'test@gmail.com',
            username: 'Test_User',
            password: 'test123',
            role: 'admin',
            firstName: 'Mary',
            lastName: 'Jos',
            department: ''
        });

        expect(result).to.be.an('object');
        expect(result).to.have.property('email', 'test@gmail.com');
        expect(result).to.have.property('role', 'admin');
    });

    // Test Case 2: Duplicate Email Error
    it('should throw an error if email already exists', async () => {
        User.findOne.resolves({ email: 'test@gmail.com' });

        await expect(authService.registerUser({
            employeeId: 'EMP123',
            email: 'test@gmail.com',
            username: 'Test_User',
            password: 'test123',
            role: 'admin',
            firstName: 'Mary',
            lastName: 'Jos',
            department: ''
        })).to.be.rejectedWith('Email already exists');
    });

    // Test Case 3: Successful Login
    it('should return a valid token on successful login', async () => {
        User.findOne.resolves({
            email: 'test@gmail.com',
            password: 'test123',
            _id: 'mocked-id',
            role: 'admin',
            department: ''
        });

        const result = await authService.loginUser('test@gmail.com', 'test123');

        expect(result).to.be.an('object');
        expect(result).to.have.property('token', 'mocked-jwt-token');
        expect(result).to.have.property('role', 'admin');
    });

    // Test Case 4: Invalid Credentials on Login
    it('should throw an error if credentials are invalid', async () => {
        User.findOne.resolves(null);

        await expect(authService.loginUser('wrong@gmail.com', 'wrongPassword'))
            .to.be.rejectedWith('Invalid credentials');
    });

    // Test Case 5: Token Validation
    it('should successfully validate a valid token', async () => {
        const token = 'mocked-jwt-token';
        const result = await authService.validateToken(token);

        expect(result).to.be.an('object');
        expect(result).to.have.property('id', 'mocked-id');
        expect(result).to.have.property('role', 'admin');
    });

    //Test Case 6: Invalid Token
    it('should throw an error if token is invalid', async () => {
        jwt.verify.throws(new Error('Invalid token'));

        await expect(authService.validateToken('invalid-token'))
            .to.be.rejectedWith('Invalid token');
    });

    // Test Case 7: Successful User Deletion
    it('should successfully delete a user', async () => {
        const mockUser = { _employeeId: 'EMP123', email: 'deleted@example.com' };
        User.findOneAndDelete.resolves(mockUser);

        const result = await authService.deleteUser('EMP123');
        expect(result).to.be.an('object');
        expect(result).to.have.property('_employeeId', 'EMP123');
    });

    //Test Case 8: Delete Non-Existent User
    it('should throw an error if user does not exist for deletion', async () => {
        User.findOneAndDelete.resolves(null); // No user found

        await expect(authService.deleteUser('invalid-id')).to.be.rejectedWith('User not found');
    });
});
