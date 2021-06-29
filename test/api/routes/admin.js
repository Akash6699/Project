const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./../models/users');
const Appointment = require('./../models/appointment');
const Completed_appointment = require('./../models/completed_appointment');
const auth = require('../middleware/auth');
const { compare } = require('bcryptjs');



//To access easily CSS and other stuff
router.use(express.static(path.join(__dirname, '../../public')));
// router.use(cookieParser());

//Middleware function in Express to passes incomming request
router.use(express.urlencoded({ extended: false }));

//All get request 

router.get('/', (req, res, next) => {
    res.render('./views/index');
})

router.get('/dashboard', auth, async (req, res, next) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    todays_date = yyyy + '-' + mm + '-' + dd;

    const appointments = await Appointment.find({ date: todays_date }).sort({ KEY: 1 });
    // console.log('Appointments = ' + appointments);


    const completed_appointments = await Completed_appointment.find().sort({ KEY: 1 });
    // console.log('Completed Appointment = '+Completed_appointment);

    //Today's Appointment
    const todays_apointment = appointments.length;
    // console.log('todays_apointment' + todays_apointment);

    //Total Doctors
    const doctors = await User.find({ usertype: "doctor" });
    const total_doctors = doctors.length;
    // console.log('Total doctors = ' + total_doctors);

    // Total patient
    const patients = await User.find({ usertype: "patient" });
    const total_patient = patients.length;
    // console.log('Total doctors = ' + total_patient);

    res.render('admin/dashboard', { appointments , completed_appointments, todays_apointment, total_doctors, total_patient  });

})

router.get('/doctors', auth, async (req, res, next) => {
    try {
        const doctors = await User.find({ usertype: "doctor" });
        res.render('admin/doctors', { doctors });
    } catch (error) {
        res.send(error);
    }

})

router.get('/patients', auth, async (req, res, next) => {
    try {
        const patients = await User.find({ usertype: "patient" });
        res.render('admin/patients', { patients })
    } catch (error) {
        res.send(err)
    }

    // res.render('admin/patient');
})

router.get('/appointment', auth, async (req, res, next) => {

    const completed_appointments = await Completed_appointment.find().sort({ KEY: 1 });
    const all_appointments = await Appointment.find().sort({ KEY: 1 });

    res.render('admin/appointment', { completed_appointments , all_appointments});
})

router.get('/add_doctor', auth, (req, res, next) => {
    res.render('admin/add_doctors');
})

router.get('/add_patient', auth, (req, res, next) => {
    res.render('admin/add_patient');
})

router.get('/doctor_details/:id', auth, async (req, res, next) => {
    try {
        const id = req.params.id;
        const doctor_info = await User.findById(id);
        res.render('admin/doctor_details', { doctor_info })
    } catch (error) {
        res.send(err)
    }
})

router.get('/patient_details/:id', auth, async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log('inside patient details');
        const patient_info = await User.findById(id);
        res.render('admin/patient_details', { patient_info })
    } catch (error) {
        res.send(err)
    }
})

router.get('/lock-screen', auth, (req, res, next) => {
    res.render('admin/lock-screen');
})

// All POST Request

router.post('/add_doctor', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {
            user = ('doctor');
            let userdata = { name: req.body.name, age: req.body.age, gender: req.body.gender, qualification: req.body.qualification, spacilization: req.body.spacilization, exprience: req.body.exprience, date_of_joining: req.body.date_of_joining, contact: req.body.contact, address: req.body.address, email: req.body.email, password: req.body.password, cpassword: req.body.cpassword, usertype: user, city: req.body.city, }
            let udata = { data: userdata }
            axios.post('http://localhost:3000/api/create-doctor', udata).then(async function (response) {
                const data = response; usertype1 = ('doctor');
                const newuser = new User({ name: req.body.name, age: req.body.age, gender: req.body.gender, qualification: req.body.qualification, spacilization: req.body.spacilization, exprience: req.body.exprience, date_of_joining: req.body.date_of_joining, contact: req.body.contact, address: req.body.address, email: req.body.email, password: req.body.password, cpassword: req.body.cpassword, usertype: usertype1, city: req.body.city, userid: data.data.data.userId, txid: data.data.data.txid, })
                const token = await newuser.generateAuthToken();
                newuser.save().then(() => { res.redirect('/admin/doctors') })
            })
        }
        else {
            res.send('Password are not matching');
        }
    } catch (error) {
        res.status(400).send(error);
    }

})


router.post('/add_patient', (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {
            user = ('patient');
            let userdata = { name: req.body.name, contact: req.body.contact, gender: req.body.gender, email: req.body.email, password: req.body.password, cpassword: req.body.cpassword, usertype: user, }
            // console.log(userdata);
            let udata = { data: userdata, }
            // console.log(udata);
            // let udata1 = []
            axios.post('http://localhost:3000/api/create-patient', udata).then(async function (response) {
                const data = response;
                usertype1 = ('patient');
                const newuser = new User({ name: req.body.name, contact: req.body.contact, gender: req.body.gender, email: req.body.email, password: req.body.password, cpassword: req.body.cpassword, usertype: user, userid: data.data.data.userId, txid: data.data.data.txid, })
                const token = await newuser.generateAuthToken();
                newuser.save().then(() => { res.redirect('/admin/patients') })
            })
        }
        else {
            res.send('Password are not matching');
        }
    } catch (error) {
        res.status(400).send(error);
    }

})

module.exports = router;
