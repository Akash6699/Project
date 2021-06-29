const jwt = require('jsonwebtoken');
const User = require('../models/users');
require("dotenv").config();
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.user;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const userenroll = await User.findOne({_id:verifyUser._id})
        req.token = token;
        req.userenroll = userenroll;
        next();
    } catch (error) {
        res.status(401).render('/logout');

    }
}

module.exports = auth;



