require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: false },
    gender: { type: String, required: true },
    qualification: { type: String, required: false },
    spacilization: { type: String, required: false },
    exprience: { type: String, required: false },
    date_of_joining: { type: String, required: false },
    contact: { type: String, required: true },
    address: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cpassword: { type: String, required: false },
    city: { type: String, required: false },
    usertype: { type: String, required: true },
    userid: { type: String, required: true },
    txid: { type: String, required: true },
    tokens: [{
        token: { type: String, required: true },
    }],
    timestamp: { type: Date, default: Date.now },

    //Addition schema for updating patient details
    _method: { type: String, required: false ,default:'' },
    age: { String, required: false ,default:'' },
    height: { type: String, required: false ,default:'' },
    weight: { type: String, required: false ,default:'' },
    gender: { type: String, required: false ,default:'' },
    mstatus: { type: String, required: false ,default:'' },
    father: { type: String, required: false ,default:'' },
    education: { type: String, required: false ,default:'' },
    address: { type: String, required: false ,default:'' },
    state: { type: String, required: false ,default:'' },
    city: { type: String, required: false ,default:'' },
    occupation: { type: String, required: false ,default:'' },
    adharno: { type: String, required: false ,default:'' },
    note: { type: String, required: false ,default:'' },
    nationality : { type: String, required: false ,default:'' }
});


// Generating Token
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (error) {
        res.send("The error part" + error);
        console.log("The error part" + error);
    }
}

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
            this.cpassword = undefined;
        }
    } catch (error) {
        return Promise.reject('There was an error creating the user: ${err}');
    }

});

const User = new mongoose.model('User', userSchema);
module.exports = User;