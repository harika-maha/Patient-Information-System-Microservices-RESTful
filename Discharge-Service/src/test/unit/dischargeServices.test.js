const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const axios = require('axios')
const Discharge = require('../../models/dischargeModel');
const { validateDischargeUpdate } = require('../../utils/dischargeValidation');
const { signedStatusValidation } = require('../../utils/signedStatusValidation');
const { createDischargeSummary,updateDischargeSummary,viewDischargeSummary,deleteDischargeSummary, appendReferral,signOffDischargeSummary } = require('../../services/index');

    const testData = {
        patientId: 'P12345',
        doctorId: 'D67890',
        unauthorizedDoctorId: 'D11111',
        patientData: {
          firstName: 'John',
          lastName: 'Doe',
          age: 45
        },
        dischargeSummaryData: {
          homeCarePlan: 'Rest for 2 weeks, follow up in OPD after 10 days',
          medications: [
            {
              name: 'Paracetamol',
              dosage: '500mg',
              frequency: '3 times a day'
            }
          ],
          referrals: [
            {
              department: 'Orthopedics',
              serviceType: 'Physiotherapy',
              notes: 'Need physiotherapy sessions',
              status: 'SCHEDULED'
            }
          ]
        },
        updateData: {
          homeCarePlan: 'Updated care plan: Rest for 3 weeks, follow up in OPD after 14 days',
          medications: [
            {
              name: 'Paracetamol',
              dosage: '650mg',
              frequency: '3 times a day'
            },
            {
              name: 'Amoxicillin',
              dosage: '500mg',
              frequency: 'twice daily'
            }
          ]
        },
        userData: {
          id: 'D67890',
          department: 'Medicine',
          authHeader: 'Bearer token123'
        }
      };
      

      describe('Discharge Service Unit Tests', function() {
        beforeEach(function() {
          //stubs
          this.findOneStub = sinon.stub(Discharge, 'findOne');
          this.findStub = sinon.stub(Discharge, 'find');
          this.findOneAndDeleteStub = sinon.stub(Discharge, 'findOneAndDelete');
          this.dischargeSaveStub = sinon.stub(Discharge.prototype, 'save');
          this.axiosGetStub = sinon.stub(axios, 'get');
          this.validateUpdateStub = sinon.stub({ validateDischargeUpdate }, 'validateDischargeUpdate');
          this.signedStatusStub = sinon.stub({ signedStatusValidation }, 'signedStatusValidation');
        });
      
        afterEach(function() {
          sinon.restore();
        });

        describe('Sign Off Discharge Summary', function() {
            it('should successfully sign off a discharge summary', async function() {
              const dischargeSummary = {
                patientId: testData.patientId,
                doctorId: testData.doctorId,
                status: 'draft',
                save: function() {
                  this.status = 'signed';
                  return this;
                }
              };
              const saveSpy = sinon.spy(dischargeSummary, 'save');
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummary);
              const result = await signOffDischargeSummary(testData.patientId, testData.doctorId);

              expect(this.findOneStub.calledOnce).to.be.true;
              expect(saveSpy.calledOnce).to.be.true;
              expect(result.status).to.equal('signed');
            });
          
            it('should throw error if discharge summary not found', async function() {
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(null);
              try {
                await signOffDischargeSummary(testData.patientId, testData.doctorId);
                expect.fail('Expected function to throw an error');
              } catch (error) {
                expect(error.message).to.equal('Discharge summary not found');
              }
            });
            it('should throw error if user is not authorized', async function() {
              const dischargeSummary = {
                patientId: testData.patientId,
                doctorId: testData.doctorId,
                status: 'draft'
              };
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummary);
              try {
                await signOffDischargeSummary(testData.patientId, testData.unauthorizedDoctorId);
                expect.fail('Expected function to throw an error');
              } catch (error) {
                expect(error.message).to.equal('Unauthorized to sign off this discharge summary');
              }
            });
          
            it('should throw error if summary already signed', async function() {
              const dischargeSummary = {
                patientId: testData.patientId,
                doctorId: testData.doctorId,
                status: 'signed'  
              };
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummary);
          
              try {
                await signOffDischargeSummary(testData.patientId, testData.doctorId);
                expect.fail('Expected function to throw an error');
              } catch (error) {
                expect(error.message).to.equal('Discharge summary already signed off');
              }
            });
          });
          describe('Create Discharge Summary', function() {
            beforeEach(function() {
              this.expectedDischargeSummary = {
                patientId: testData.patientId,
                patientDetails: {
                  firstname: testData.patientData.firstName,
                  lastname: testData.patientData.lastName,
                  age: testData.patientData.age,
                  department: testData.userData.department
                },
                doctorId: testData.userData.id,
                homeCarePlan: testData.dischargeSummaryData.homeCarePlan,
                medications: testData.dischargeSummaryData.medications,
                status: 'draft',
                referrals: testData.dischargeSummaryData.referrals
              };
              this.mockPatientResponse = {
                data: {
                  patientId: testData.patientId,
                  firstName: testData.patientData.firstName,
                  lastName: testData.patientData.lastName,
                  age: testData.patientData.age
                }
              };
            });
          
            it('should successfully create a discharge summary', async function() {
              this.axiosGetStub.resolves(this.mockPatientResponse);
              this.dischargeSaveStub.resolves(this.expectedDischargeSummary);
              expect(await createDischargeSummary(
                testData.patientId, 
                testData.dischargeSummaryData, 
                testData.userData
              )).to.deep.equal(this.expectedDischargeSummary);

              expect(this.axiosGetStub.calledOnce).to.be.true;
              expect(this.axiosGetStub.firstCall.args[0]).to.include(testData.patientId);
              expect(this.dischargeSaveStub.calledOnce).to.be.true;
            });
          
            it('should throw error if patient API request fails', async function() {
              this.axiosGetStub.rejects({
                message: 'Patient not found'
              });

              try {
                await createDischargeSummary(
                  testData.patientId, 
                  testData.dischargeSummaryData, 
                  testData.userData
                );
                expect.fail('Expected function to throw an error');
              } catch (error) {
                expect(error.message).to.include('Error connecting to patient service');
              }
            });
            
            it('should handle empty referrals array correctly', async function() {
              this.axiosGetStub.resolves(this.mockPatientResponse);
              const expectedSummaryWithoutReferrals = { ...this.expectedDischargeSummary };
              delete expectedSummaryWithoutReferrals.referrals;
              this.dischargeSaveStub.resolves(expectedSummaryWithoutReferrals);
              const dataWithoutReferrals = {
                homeCarePlan: testData.dischargeSummaryData.homeCarePlan,
                medications: testData.dischargeSummaryData.medications
              };
              expect(await createDischargeSummary(
                testData.patientId, 
                dataWithoutReferrals, 
                testData.userData
              )).to.deep.equal(expectedSummaryWithoutReferrals);
              
              expect(this.dischargeSaveStub.calledOnce).to.be.true;
            });
          });
          describe('Update Discharge Summary', function() {
            it('should successfully update a discharge summary', async function() {
              const dischargeSummary = {
                patientId: testData.patientId,
                doctorId: testData.doctorId,
                status: 'draft',
                homeCarePlan: 'Old care plan',
                medications: [{ name: 'Old medication', dosage: '500mg', frequency: 'daily' }],
                save: sinon.stub().resolves({
                  patientId: testData.patientId,
                  doctorId: testData.doctorId,
                  status: 'draft',
                  homeCarePlan: testData.updateData.homeCarePlan,
                  medications: testData.updateData.medications
                })
              };
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummary);
              this.validateUpdateStub.returns(true);
              this.signedStatusStub.returns(true);

              const result = await updateDischargeSummary(
                testData.patientId, 
                testData.updateData, 
                testData.doctorId
              );
              expect(this.findOneStub.calledOnce).to.be.true;
              expect(result.homeCarePlan).to.equal(testData.updateData.homeCarePlan);
              expect(result.medications).to.deep.equal(testData.updateData.medications);
            });
            it('should throw error if user is not authorized', async function() {
              const dischargeSummary = {
                patientId: testData.patientId,
                doctorId: testData.doctorId,
                status: 'draft'
              };
              
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummary);
          
              try {
                await updateDischargeSummary(
                  testData.patientId, 
                  testData.updateData, 
                  testData.unauthorizedDoctorId
                );
                expect.fail('Expected function to throw an error');
              } catch (error) {
                expect(error.message).to.equal('Not authorized to update summary');
              }
            });
          
            it('should throw error if discharge summary is already signed', async function() {
              const dischargeSummary = {
                patientId: testData.patientId,
                doctorId: testData.doctorId,
                status: 'signed'
              };
              
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummary);
              this.signedStatusStub.throws(new Error('Cannot update a signed discharge summary'));
          
              try {
                await updateDischargeSummary(
                  testData.patientId, 
                  testData.updateData, 
                  testData.doctorId
                );
                expect.fail('Expected function to throw an error');
              } catch (error) {
                expect(error.message).to.equal('Cannot modify a signed discharge summary');
              }
            });
          });
          describe('View Discharge Summary', function() {
            it('should successfully retrieve discharge summaries for a patient', async function() {
              const dischargeSummaries = [
                {
                  patientId: testData.patientId,
                  patientDetails: {
                    firstname: testData.patientData.firstName,
                    lastname: testData.patientData.lastName,
                    age: testData.patientData.age,
                    department: testData.userData.department
                  },
                  doctorId: testData.doctorId,
                  homeCarePlan: 'Rest for 2 weeks',
                  medications: [
                    { name: 'Paracetamol', dosage: '500mg', frequency: '3 times a day' }
                  ],
                  status: 'draft'
                }
              ];
              this.findStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummaries);
              const result = await viewDischargeSummary(testData.patientId);
              expect(this.findStub.calledOnce).to.be.true;
              expect(result).to.deep.equal(dischargeSummaries);
              expect(result[0].patientId).to.equal(testData.patientId);
              expect(result[0].status).to.equal('draft');
            });
          
            it('should throw error if discharge summary not found', async function() {
              this.findStub.withArgs({patientId: testData.patientId}).resolves(null);
              try {
                await viewDischargeSummary(testData.patientId);
                expect.fail('Expected function to throw an error');
              } catch (error) {
                expect(error.message).to.equal('Discharge summary not found');
              }
            });
          });
          describe('Delete Discharge Summary', function() {
            it('should successfully delete a discharge summary', async function() {
              const dischargeSummary = {
                patientId: testData.patientId,
                doctorId: testData.doctorId,
                status: 'draft'
              };
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummary);
              this.findOneAndDeleteStub.withArgs({patientId: testData.patientId}).resolves({});
              const result = await deleteDischargeSummary(testData.patientId, testData.doctorId);

              expect(this.findOneStub.calledOnce).to.be.true;
              expect(this.findOneAndDeleteStub.calledOnce).to.be.true;
              expect(result).to.have.property('message');
              expect(result.message).to.include('deleted successfully');
            });
          
            it('should throw error if discharge summary not found', async function() {
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(null);
              try {
                await deleteDischargeSummary(testData.patientId, testData.doctorId);
                expect.fail('Expected function to throw an error');
              } catch (error) {
                expect(error.message).to.equal('Discharge summary not found');
              }
            });
            it('should throw error if user is not authorized', async function() {
              const dischargeSummary = {
                patientId: testData.patientId,
                doctorId: testData.doctorId,
                status: 'draft'
              };
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummary);
              try {
                await deleteDischargeSummary(testData.patientId, testData.unauthorizedDoctorId);
                expect.fail('Expected function to throw an error');
              } catch (error) {
                expect(error.message).to.equal('Not authorized to delete this discharge summary');
              }
            });
          });
          describe('Append Referral to Discharge Summary', function() {
            
            const referralData = {
              department: 'Orthopedics',
              serviceType: 'Physiotherapy',
              notes: 'Need physiotherapy sessions',
              status: 'SCHEDULED'
            };
            it('should successfully add a referral to a discharge summary', async function() {
              const dischargeSummary = {
                patientId: testData.patientId,
                doctorId: testData.userData.id,
                status: 'draft',
                referrals: [],
                save: sinon.stub().resolves({
                    patientId: testData.patientId,
                    doctorId: testData.userData.id,
                  status: 'draft',
                  referrals: [referralData]
                })
              };
              this.findOneStub.withArgs({patientId: testData.patientId}).resolves(dischargeSummary);
              this.signedStatusStub.returns(true);
              const result = await appendReferral(testData.patientId, referralData, testData.userData.id);
              
              expect(result.referrals[0]).to.deep.equal(referralData);
            });
          });
      });