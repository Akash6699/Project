require("dotenv").config();
const http = require('http');
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT;
const app = require('./app');
const server = http.createServer(app);


server.listen(PORT, ()=>{console.log (`App is running on localhost: ${PORT}`)})