const mongoose = require('mongoose');
require('dotenv').config();


function connectDB() {

    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
     }).then(()=>{
         console.log(`Databse connected.`)
     }).catch(err=>{
         console.log(`db error ${err.message}`);
         process.exit(-1)
     })
}


module.exports = connectDB;