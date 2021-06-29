require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
const Users = require('./api/models/users');
const auth = require('./api/middleware/auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { compare } = require('bcryptjs');




//For Proxy
const http = require('http');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



const adminRoute = require('./api/routes/admin');
const patientRoute = require('./api/routes/patient');
const doctorRoute = require('./api/routes/doctor');
const { compareSync } = require('bcryptjs');

//Routes for frontend
app.use('/admin', adminRoute);
app.use('/doctor', doctorRoute);
app.use('/patient', patientRoute);
app.use(express.static(__dirname + '/public'));


// Navigation
app.get('/', (req, res, next) => {
    res.render('index');
})

app.post('/login', async (req, res) => {
    try {
        const email1 = req.body.email;
        const password = req.body.password;
        const useremail = await Users.findOne({ email: email1 })
        const isMatch = await bcrypt.compare(password, useremail.password);
        const token = await useremail.generateAuthToken();
        // res.cookie('user', token, { expires: new Date(Date.now() + 300000), httpOnly: true });
        if (isMatch) {
            usertype = useremail.usertype;
            if (usertype === 'admin') {
                res.cookie('user', token)//, { expires: new Date(Date.now() + 300000), httpOnly: true });
                return res.status(201).redirect('/admin/dashboard');
            }
            if (usertype === 'patient') {
                res.cookie('user', token);//, { expires: new Date(Date.now() + 300000), httpOnly: true });
                return res.status(201).redirect('/patient/dashboard');
            }
            if (usertype === 'doctor') {
                res.cookie('user', token);//, { expires: new Date(Date.now() + 300000), httpOnly: true });
                return res.status(201).redirect('/doctor/dashboard');
            }
            else
                return res.status(404).redirect('*');
        }
        else {
            return res.send("Invalid password details")
        }
    } catch (error) {
        return res.status(400).send("invalid login details")
    }

})

app.get('/logout', auth, async (req, res) => {

    try {

        // // For singal User Logout
        // req.userenroll.tokens = req.userenroll.tokens.filter((currElement) => {
        //     return currElement.token !== req.token
        // })

        // For All User Logout
        req.userenroll.tokens =[]
        res.clearCookie('user');
        await req.userenroll.save();
        res.render('index');
    } catch (error) {
        res.status(500), send(error);
    }

})

app.use('*', (req, res, next) => {
    res.render('error');
})

module.exports = app;