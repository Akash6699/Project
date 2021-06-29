const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('./../models/users');
const Appointment = require('./../models/appointment');
const Completed_appointment = require('./../models/completed_appointment');
const auth = require('../middleware/auth');
const axios = require('axios');


router.use(express.static(path.join(__dirname, '../../public')));


//For IPFS Uploading

const fs = require('fs');

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })


//Routes for doctors feild
router.get('/', (req, res, next) => {
    res.render('index');
})

router.get('/dashboard', auth, async (req, res, next) => {
    try {



        //Taking current date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        todays_date = yyyy + '-' + mm + '-' + dd;

        let userenroll = await req.userenroll;
        // console.log(userenroll);
        const todays_appointment = await Appointment.find({ date: todays_date, doctor: userenroll.name });
        const todays_count = todays_appointment.length;
        


        // Total Appointment
        const total_appo1 = await Completed_appointment.find({ doctor: userenroll.name  });
        const total_appo = total_appo1.length + todays_count;
        

        // Total patient
        const patients = await User.find({ usertype: "patient" });
        const patient_count = patients.length;
        

        res.render('doctor/dashboard', { userenroll, todays_appointment , todays_count , total_appo, patient_count});

    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

router.get('/patient', auth, async (req, res, next) => {
    try {

        //Get current user name
        let userenroll = await req.userenroll;
        const patient_appoinment = await Appointment.find({ doctor: userenroll.name });

        //Get patients from database
        patient = []
        for (let i = 0; i < patient_appoinment.length; i++) {
            patient.push(patient_appoinment[i].patient_id);
        }
        //Get complete user data from User Database 
        const patients = await User.find({ _id: patient });

        res.render('doctor/patient', { patient_appoinment, patients })
    } catch (error) {
        res.send(err)
    }

    // res.render('doctor/patient');   
})

router.get('/appointment', auth, async (req, res, next) => {
    let userenroll = await req.userenroll;
    
    const all_appointments = await Appointment.find({ doctor: userenroll.name }).sort({ KEY: 1 });

    const completed_appointments = await Completed_appointment.find({ doctor: userenroll.name  }).sort({ KEY: 1 });

    res.render('doctor/appointment', { completed_appointments , all_appointments});
})

router.get('/lock_screen', auth, (req, res, next) => {
    res.render('doctor/lock-screen');
})

router.get('/appointment_patient_details/:id', auth, async (req, res, next) => {
    // console.log('From Appointment fill details');
    const appo_id = req.params.id;
    // console.log('From database id='+appo_id);

    const foundappointment = await Appointment.findById(appo_id);
    // console.log('appo_id'+foundappointment);

    const id = foundappointment.patient_id;
    // console.log('patient_Id'+id);

    const patient_info = await User.findById(id);

    res.render('doctor/appointment_patient_details', { patient_info, foundappointment });
})

router.get('/upload_document/:id', auth, (req, res, next) => {
    const id = req.params.id;
    // console.log('inside routes');
    res.render('doctor/upload_document', { id });

})

router.post('/upload_document/:id', upload.single('avatar'), auth, async function (req, res, next) {
    // console.log('inside upload document');
    const appo_id = req.params.id;
    // console.log('From appointment page='+appo_id);

    const foundappointment = await Appointment.findById(appo_id);
    // console.log('appo_id'+foundappointment);

    const id = foundappointment.patient_id;
    // console.log('Patient Id='+id);

    const patient_info = await User.findById(id);
    // console.log('patient_info' + patient_info);

    var data = await Buffer.from(fs.readFileSync(req.file.path));
    const hashdata = await ipfs.add(data, async function (err, file) {
        if (err) {
            console.log(err);
        }

        hashvalue = file[0].hash;
        // console.log(hashvalue);
        Appointment.findOneAndUpdate({ _id: appo_id }, { report_hash: hashvalue }, { new: true }, (err, foundappointment) => {
            if (err) {
                console.log('Couldnt update=' + err);
            }
            // console.log('Success' + foundappointment);
            res.render('doctor/appointment_patient_details', { foundappointment, patient_info });
        })
    })
})

router.post('/upload_document1/:id', upload.single('avatar'), auth, async function (req, res, next) {
    // console.log('inside upload document');
    const appo_id = req.params.id;
    // console.log('From appointment page='+appo_id);

    const foundappointment = await Appointment.findById(appo_id);
    // console.log('appo_id'+foundappointment);

    const id = foundappointment.patient_id;
    // console.log('Patient Id='+id);

    const patient_info = await User.findById(id);
    // console.log('patient_info' + patient_info);

    var data = await Buffer.from(fs.readFileSync(req.file.path));
    const hashdata = await ipfs.add(data, async function (err, file) {
        if (err) {
            console.log(err);
        }

        hashvalue = file[0].hash;
        // console.log(hashvalue);
        Appointment.findOneAndUpdate({ _id: appo_id }, { recipt_hash: hashvalue }, { new: true }, (err, foundappointment) => {
            if (err) {
                console.log('Couldnt update=' + err);
            }
            // console.log('Success' + foundappointment);
            res.render('doctor/appointment_patient_details', { foundappointment, patient_info });
        })
    })
})

router.post('/complet_appointment/:id/:appo_id', async (req, res) => {
    try {
        // console.log('indise complete appointment');
        const id = req.params.id;
        const appo_id = req.params.appo_id;
        const patient_info = await User.findById(id);
        const userid = patient_info.userid;
        const appointment = await Appointment.findById(appo_id);
        let dignosis = {
            report_hash: appointment.report_hash,
            recipt_hash: appointment.recipt_hash,
            desease_name: req.body.desease_name,
            desease_stage: req.body.desease_stage,
            description: req.body.description,
            medicine_given: req.body.medicine_given
        }
        let userdata = {
            userId: userid,
            data: dignosis
        }
        axios.post('http://localhost:3000/api/add-diagnosis', userdata).then(async function (response) {
            const data = response;
            const complete_appo_data = new Completed_appointment({
                date: appointment.date,
                time: appointment.time,
                specilist: appointment.specilist,
                doctor: appointment.doctor,
                insurance_id: appointment.insurance_id,
                iffacility: appointment.iffacility,
                ifallergies: appointment.ifallergies,
                problem: appointment.problem,
                operations: appointment.operations,
                excersise: appointment.excersise,
                diet_plan: appointment.diet_plan,
                alcohol: appointment.alcohol,
                drink: appointment.drink,
                smoke: appointment.smoke,
                other_medical: appointment.other_medical,
                patient_id: appointment.patient_id,
                patient_userid: appointment.patient_userid,
                patient_txid: appointment.patient_txid,
                patient_name: appointment.patient_name,
                report_hash: appointment.report_hash,
                recipt_hash: appointment.recipt_hash,
                appointment_id: appointment._id,
                desease_name: req.body.desease_name,
                desease_stage: req.body.desease_stage,
                description: req.body.description,
                medicine_given: req.body.medicine_given,
                appointment_txid : appointment.appointment_txid,
                this_appo_txid: data.data.data.txid,
            })
            complete_appo_data.save();
            const appointment_id = appointment._id;
            Appointment.findByIdAndDelete(appointment_id, function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    // console.log("Deleted : ", docs);
                }
            });
            res.redirect('/doctor/dashboard');
        })
    } catch (error) {
        res.status(400).send(error);
    }

})

router.get('/patient_details', auth, (req, res) => {
    res.render('doctor/patient_details');
})

module.exports = router;
