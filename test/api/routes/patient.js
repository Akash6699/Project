const express = require('express');
const router = express.Router();
const path = require('path');
const methodOverride = require('method-override');
const User = require('./../models/users');
const Appointment = require('./../models/appointment');
const Completed_appointment = require('./../models/completed_appointment');
const auth = require('../middleware/auth');
const axios = require('axios');


router.use(express.static(path.join(__dirname, '../../public')));
router.use(methodOverride('_method'));

router.get('/', (req, res, next) => {
    res.render('index.html');
})

router.get('/dashboard', auth, async (req, res, next) => {
    try {
        let userenroll = await req.userenroll;
        const id = userenroll._id
        const appointments = await Completed_appointment.find({ patient_id: userenroll._id }).sort({ x: 1 });
        // const appo_length = appointments.length;
        const appo_all = appointments.length;
        // console.log(appo_length);
        // console.log(appo_all);
        
        
        res.render('patient/dashboard', { userenroll, appointments, appo_all });
    } catch (error) {
        res.send(error);
    }
})
router.get('/book_appo', auth, async (req, res, next) => {
    let userenroll = await req.userenroll;
    const appointments = await Completed_appointment.find({ patient_id: userenroll._id }).sort({ x: -1 });
    const count = appointments.length;
    // console.log(count);
    const all_count = appointments.length;
    // console.log(all_count);
    res.render('patient/book_appo', { appointments , all_count})
})

router.post('/book_appo', auth, async (req, res, next) => {
    try {
        let userenroll = await req.userenroll;
        let appointment = {
            date: req.body.date,
            time: req.body.time,
            specilist: req.body.specilist,
            doctor: req.body.doctor,
            insurance_id: req.body.insurance_id,
            iffacility: req.body.iffacility,
            ifallergies: req.body.ifallergies,
            problem: req.body.problem,
            operations: req.body.operations,
            excersise: req.body.excersise,
            diet_plan: req.body.diet_plan,
            alcohol: req.body.alcohol,
            drink: req.body.drink,
            smoke: req.body.smoke,
            other_medical: req.body.other_medical
        }
        let appointment_data = {
            userId: userenroll.userid,
            data: appointment
        }
        axios.post('http://localhost:3000/api/add-treatment', appointment_data).then(async function (response) {
            const data = response;
            const appointment = new Appointment({
                date: req.body.date,
                time: req.body.time,
                specilist: req.body.specilist,
                doctor: req.body.doctor,
                insurance_id: req.body.insurance_id,
                iffacility: req.body.iffacility,
                ifallergies: req.body.ifallergies,
                problem: req.body.problem,
                operations: req.body.operations,
                excersise: req.body.excersise,
                diet_plan: req.body.diet_plan,
                alcohol: req.body.alcohol,
                drink: req.body.drink,
                smoke: req.body.smoke,
                other_medical: req.body.other_medical,
                patient_id: userenroll._id,
                patient_userid: userenroll.userid,
                patient_txid: userenroll.txid,
                patient_name: userenroll.name,
                appointment_txid: data.data.data.txid
            })
            appointment.save().then(() => { res.redirect('/patient/dashboard') })
        })
    }
    catch (error) {
        res.status(400).send(error);
    }
})

router.get('/book_appo/:specilist', auth, async (req, res, next) => {
    try {
        const specilist = await User.find({ spacilization: req.params.specilist });
        res.send(specilist)
    } catch (error) {
        res.send(error);
    }
})

router.get('/appointment', auth, async (req, res, next) => {
    try {
        let userenroll = await req.userenroll;
        const appointments = await Completed_appointment.find({ patient_id: userenroll._id });

        // const appointments = await Appointment.find({ patient_id: userenroll._id });

        res.render('patient/appointment', { appointments })
    } catch (error) {
        res.send(error)
    }
})


router.get('/lock_screen', auth, (req, res, next) => {
    res.render('patient/lock-screen');
})

router.get('/updatedetails', auth, async (req, res) => {
    try {
        let userenroll = await req.userenroll;
        res.render('patient/updatedetails', { userenroll });
    } catch (error) {
        res.send(error);
    }
})

router.patch('/updatedetails/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const updateuser = await User.findByIdAndUpdate(id, req.body, { new: true });
        updateuser.save().then(() => { res.redirect('/patient/dashboard') })
    } catch (e) {
        res.send(e);
    }
})

module.exports = router;
