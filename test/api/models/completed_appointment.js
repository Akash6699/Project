require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const completed_appointmentSchema = new Schema({
    date: { type: String, required: true, default: '' },
    time: { type: String, required: true, default: '' },
    specilist: { type: String, required: true, default: '' },
    doctor: { type: String, required: true, default: '' },
    insurance_id: { type: String, required: false, default: '' },
    iffacility: { type: String, required: false, default: '' },
    ifallergies: { type: String, required: false, default: '' },
    problem: { type: String, required: true, default: '' },
    operations: { type: String, required: true, default: '' },
    excersise: { type: String, required: true, default: '' },
    diet_plan: { type: String, required: true, default: '' },
    alcohol: { type: String, required: true, default: '' },
    drink: { type: String, required: true, default: '' },
    smoke: { type: String, required: true, default: '' },
    other_medical: { type: String, required: true, default: '' },
    patient_id : { type: String, required: true, default: '' },
    patient_userid : { type: String, required: true, default: '' },
    patient_txid : { type: String, required: true, default: '' },
    patient_name : { type: String, required: true, default: '' },
    report_hash :{ type: String, required: true, default: '' },
    recipt_hash :{ type: String, required: true, default: '' },
    appointment_id :{ type: String, required: true, default: '' },
    desease_name: { type: String, required: true ,default:'' },
    desease_stage: { type: String, required: true ,default:'' },
    description: { type: String, required: true ,default:'' },
    medicine_given: { type: String, required: true ,default:'' },
    appointment_id: { type: String, required: true ,default:'' },
    appointment_txid :{ type: String, required: true ,default:'' },
    this_appo_txid : { type: String, required: true ,default:'' }
});

const Completed_appointment = new mongoose.model('Completed_appointment', completed_appointmentSchema);
module.exports = Completed_appointment;