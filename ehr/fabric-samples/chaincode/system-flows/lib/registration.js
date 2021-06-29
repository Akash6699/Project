/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const shim = require('fabric-shim');
const util = require('util');

let bRegistration = class {
    async Init(stub) {
        return stub.putState('dummyKey', Buffer.from('dummyValue'))
            .then(() => {
                console.info('Chaincode instantiation is successful');
                return shim.success();
            }, () => {
                return shim.error();
            });
    }

    async Invoke(stub) {
        console.info('Transaction ID: ' + stub.getTxID());
        console.info(util.format('Args: %j', stub.getArgs()));

        let ret = stub.getFunctionAndParameters();
        console.info(ret);

        let method = this[ret.fcn];
        if (!method) {
            console.log('no function of name:' + ret.fcn + ' found');
            throw new Error('Received unknown function ' + ret.fcn + ' invocation');
        }
        try {
            console.info('Calling function: ' + ret.fcn);
            let payload = await method(stub, ret.params, this);
            return shim.success(payload);
        } catch (err) {
            console.log(err);
            return shim.error(err);
        }
    }

    async createDoctor(stub, args) {

        //checks fir null data
        if (args[0].length <= 0) {
            throw new Error('1st argument must be a non-empty string');
        }
        if (args[1].length <= 0) {
            throw new Error('2nd argument must be a non-empty string');
        }

        let userId = args[0];

        // record contains data from ledger
        let record = {
            userId : userId,
            data : args[1]
        }
        
        //inserting data into ledger
        await stub.putState(userId, Buffer.from(JSON.stringify(record)));
        //fetch tx id as proof
        let txid = stub.getTxID();
        return Buffer.from(JSON.stringify({'txid' : txid, 'userId' : userId ,'msg' : 'User Created successfully'}))
    }

    async createPatient(stub, args) {

        //checks fir null data
        if (args[0].length <= 0) {
            throw new Error('1st argument must be a non-empty string');
        }
        if (args[1].length <= 0) {
            throw new Error('2nd argument must be a non-empty string');
        }

        let userId = args[0];

        // record contains data from ledger
        let record = {
            userId : userId,
            data : args[1],
            diagnosis : [],
            treatment : []
        }

        //inserting data into ledger
        await stub.putState(userId, Buffer.from(JSON.stringify(record)));
        //fetch tx id as proof
        let txid = stub.getTxID();
        return Buffer.from(JSON.stringify({'txid' : txid, 'userId' : userId ,'msg' : 'User Created successfully'}))
    }


    async getUser(stub, args) {

        if (args.length != 1) {
            throw new Error('Incorrect number of arguments. Expecting userId');
        }

        let userId = args[0];
        if (!userId) {
          throw new Error('userId must not be empty');
        }
        // bData contains data from ledger
        let bData = await stub.getState(userId);
        if (!bData.toString())
            throw new Error(`User for given ${userId} does not exist`)
        //userRecord contains the data to be sent as response
        let userRecord = JSON.parse(bData.toString())
        console.info('=======================================');
        console.log(userRecord.toString());
        console.info('=======================================');
        return Buffer.from(JSON.stringify(userRecord));


    }

    async addTreatment(stub, args) {

        if (args[0].length <= 0) {
            throw new Error('Incorrect number of arguments. Expecting patientId');
        }
        if (args[1].length <= 0) {
            throw new Error('data must be a non-empty string');
        }
        let userId = args[0];
        let treatmentData = JSON.parse(args[1]);
        if (!userId) {
           throw new Error('userId must not be empty');
        }
        // bData contains data from ledger
        let bData = await stub.getState(userId);
        console.log(bData.toString());
        if (!bData.toString())
            throw new Error(`User for given ${userId} does not exist`)
        //userRecord contains the data to be sent as response
        console.info('=======================================ADDING TREATMENT=======================================');
        let userRecord = JSON.parse(bData.toString())
        userRecord.treatment.push(treatmentData);
        
        console.log(userRecord.treatment.toString());
        await stub.putState(userId, Buffer.from(JSON.stringify(userRecord)));
        console.info('=======================================TREATMENT ADDED=========================================');
        //fetch tx id as proof
        let txid = stub.getTxID();
        return Buffer.from(JSON.stringify({'txid' : txid, 'userId' : userId ,'msg' : 'Treatment Data updated successfully'}))
  
    }

    async addDiagnosis(stub, args) {

        if (args[0].length <= 0) {
            throw new Error('Incorrect number of arguments. Expecting patientId');
        }
        if (args[1].length <= 0) {
            throw new Error('data must be a non-empty string');
        }
        let userId = args[0];
        let diagnosisData = JSON.parse(args[1]);
        if (!userId) {
           throw new Error('userId must not be empty');
        }
        // bData contains data from ledger
        let bData = await stub.getState(userId);
        if (!bData.toString())
            throw new Error(`User for given ${userId} does not exist`)
        //userRecord contains the data to be sent as response
        console.info('=======================================ADDING Diagnosis=======================================');
        let userRecord = JSON.parse(bData.toString())
        userRecord.diagnosis.push(diagnosisData);
        
        console.log(userRecord.diagnosis.toString());
        await stub.putState(userId, Buffer.from(JSON.stringify(userRecord)));
        console.info('=======================================Diagnosis ADDED=========================================');
        //fetch tx id as proof
        let txid = stub.getTxID();
        return Buffer.from(JSON.stringify({'txid' : txid, 'userId' : userId ,'msg' : 'Diagnosis Data updated successfully'}))

    }

};

shim.start(new bRegistration());
