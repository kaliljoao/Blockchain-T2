/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MedicationContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const meds = [
            {
                manufacturer: '426R',
                name: 'Dipirona',
                dosage: '400',
                fabDate: '1574973266',
                expDate: '1665446400',
                status: "stock",
                prescription: null
            },
            {
                manufacturer: 'J205',
                name: 'Azitromicina',
                dosage: '200',
                fabDate: '1574973266',
                expDate: '1665446400',
                status: "stock",
                prescription: null
            }
        ];

        for (let i = 0; i < meds.length; i++) {
            meds[i].docType = 'med';
            await ctx.stub.putState('MED' + i, Buffer.from(JSON.stringify(meds[i])));
            console.info('Added <--> ', meds[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async medicationExists(ctx, medicationId) {
        const buffer = await ctx.stub.getState(medicationId);
        return (!!buffer && buffer.length > 0);
    }

    async createMedication(ctx, medicationId, value) {
        const exists = await this.medicationExists(ctx, medicationId);
        if (exists) {
            throw new Error(`The medication ${medicationId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(medicationId, buffer);
    }

    async readMedication(ctx, medicationId) {
        const exists = await this.medicationExists(ctx, medicationId);
        if (!exists) {
            throw new Error(`The medication ${medicationId} does not exist`);
        }
        const buffer = await ctx.stub.getState(medicationId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateMedication(ctx, medicationId, newValue) {
        // TODO: Relacionar medicamento com uma venda e uma receita
        const exists = await this.medicationExists(ctx, medicationId);
        if (!exists) {
            throw new Error(`The medication ${medicationId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(medicationId, buffer);
    }

    async deleteMedication(ctx, medicationId) {
        const exists = await this.medicationExists(ctx, medicationId);
        if (!exists) {
            throw new Error(`The medication ${medicationId} does not exist`);
        }
        await ctx.stub.deleteState(medicationId);
    }

    /* ============================FUNCOES PARA RECEITAS MÉDICAS==============================*/
    
    async prescriptionExists(ctx, prescriptionId) {
        const buffer = await ctx.stub.getState(prescriptionId);
        return (!!buffer && buffer.length > 0);
    }
    
    /**
     * 
     * @param {*} ctx 
     * @param {*} prescriptionId Identificacao da receita
     * @param {Array} medications Lista de objetos com nome dos medicamentos e descricao de uso
     * @param {*} doctorId Identificacao do medico que fez a receita
     * @param {*} hospitalId Identificacao do hospital gerador da receita
     */
    async createPrescription(ctx, prescriptionId, medications, patientId, doctorId) {
        const exists = await this.prescriptionExists(ctx, prescriptionId);
        if (exists) {
            throw new Error(`The prescription ${prescriptionId} already exists`);
        }
        const hospitalId = "HOS01";
        // const parsedMedication = JSON.parse(medications);
        const asset = { prescriptionId, medications, patientId, doctorId, hospitalId };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(prescriptionId, buffer);
    }

    async verifyPrescription(ctx, medicationId ,prescriptionId) {
        const prescriptionExists = await this.prescriptionExists(ctx, prescriptionId);
        if (!prescriptionExists) {
            throw new Error(`The prescription ${prescriptionId} does not exist`);
        }

        const medicationExists = await this.medicationExists(ctx, prescriptionId);
        if (!medicationExists) {
            throw new Error(`The prescription ${prescriptionId} does not exist`);
        }

        const medicationBuffer = await ctx.stub.getState(medicationId);
        const prescriptionBuffer = await ctx.stub.getState(prescriptionId);

        const medicationAsset = JSON.parse(medicationBuffer.toString());
        const prescriptionAsset = JSON.parse(prescriptionBuffer.toString());

        console.log("Verify prescription:")
        console.log("Medication Asset", medicationAsset);
        console.log("Prescription Asset", prescriptionAsset);
    }

    async queryPrescription(ctx, prescriptionId) {
        const exists = await this.prescriptionExists(ctx, prescriptionId);
        if (!exists) {
            throw new Error(`The prescription ${prescriptionId} does not exist`);
        }
        const buffer = await ctx.stub.getState(prescriptionId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async deletePrescription(ctx, prescriptionId) {
        const exists = await this.prescriptionExists(ctx, prescriptionId);
        if (!exists) {
            throw new Error(`The prescription ${prescriptionId} does not exist`);
        }
        await ctx.stub.deleteState(prescriptionId);
    }

    async queryAllPrescription(ctx){
        const startKey = 'PES0';
        const endKey = 'PES999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
    /* ============================FUNCOES PARA VENDA==============================*/
    async createRegister(ctx, Id, medicationId, prescriptionId){
        const med_JSON = await this.readMedication(ctx,medicationId);
        const pes_JSON = await this.queryPrescription(ctx,prescriptionId);
        const medication = Buffer.from(JSON.stringify(med_JSON));;
        const prescription = Buffer.from(JSON.stringify(pes_JSON));
        ctx.stub.putState(Id, medication, prescription);
    }

    async queryAllSales(ctx){
        const startKey = 'SALE1';
        const endKey = 'SALE99';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }


}

module.exports = MedicationContract;
