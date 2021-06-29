require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    date: { type: String, required: true, default: '' },
    time: { type: String, required: true, default: '' },
    specilist: { type: String, required: true, default: '' },
    doctor: { type: String, required: true, default: '' },
    insurance_id: { type: String, required: false, default: '' },
    iffacility: { type: String, required: false, default: '' },
    ifallergies: { type: String, required: false, default: '' },
    problem: { type: String, required: true, default: '' },
    operations: { type: String, required: false, default: '' },
    excersise: { type: String, required: true, default: '' },
    diet_plan: { type: String, required: true, default: '' },
    alcohol: { type: String, required: true, default: '' },
    drink: { type: String, required: true, default: '' },
    smoke: { type: String, required: true, default: '' },
    other_medical: { type: String, required: false, default: '' },
    patient_id : { type: String, required: true, default: '' },
    patient_userid : { type: String, required: true, default: '' },
    patient_txid : { type: String, required: true, default: '' },
    patient_name : { type: String, required: true, default: '' },
    report_hash :{ type: String, required: false, default: '' },
    recipt_hash :{ type: String, required: false, default: '' },
    appointment_txid : { type: String, required: true, default: '' },
});

const Appointment = new mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;