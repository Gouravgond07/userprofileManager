const express = require("express");
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const UserRoute = require('./routers/user.router');
var multer = require('multer');
var upload = multer();
//form-urlencoded

// for parsing multipart/form-data

app.use(cors());


// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));

// // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// // Put these statements before you define any routes.


// Cryptography or Encryption-Decryption
//Set static folder
// console.log(path.join(__dirname, '/uploads'))
// app.use(express.static(path.join(__dirname, '/uploads')));

app.use("/user", UserRoute);
app.use((req, res, next) => {
    var err = new Error("Route Not Found");
    // @ts-ignore
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({
        message: err.message || 'Server Error'
    });
})

module.exports = app;