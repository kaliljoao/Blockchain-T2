/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MedicationContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('MedicationContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new MedicationContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"medication 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"medication 1002 value"}'));
    });

    describe('#medicationExists', () => {

        it('should return true for a medication', async () => {
            await contract.medicationExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a medication that does not exist', async () => {
            await contract.medicationExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMedication', () => {

        it('should create a medication', async () => {
            await contract.createMedication(ctx, '1003', 'medication 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"medication 1003 value"}'));
        });

        it('should throw an error for a medication that already exists', async () => {
            await contract.createMedication(ctx, '1001', 'myvalue').should.be.rejectedWith(/The medication 1001 already exists/);
        });

    });

    describe('#readMedication', () => {

        it('should return a medication', async () => {
            await contract.readMedication(ctx, '1001').should.eventually.deep.equal({ value: 'medication 1001 value' });
        });

        it('should throw an error for a medication that does not exist', async () => {
            await contract.readMedication(ctx, '1003').should.be.rejectedWith(/The medication 1003 does not exist/);
        });

    });

    describe('#updateMedication', () => {

        it('should update a medication', async () => {
            await contract.updateMedication(ctx, '1001', 'medication 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"medication 1001 new value"}'));
        });

        it('should throw an error for a medication that does not exist', async () => {
            await contract.updateMedication(ctx, '1003', 'medication 1003 new value').should.be.rejectedWith(/The medication 1003 does not exist/);
        });

    });

    describe('#deleteMedication', () => {

        it('should delete a medication', async () => {
            await contract.deleteMedication(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a medication that does not exist', async () => {
            await contract.deleteMedication(ctx, '1003').should.be.rejectedWith(/The medication 1003 does not exist/);
        });

    });

});