const router = require("express").Router();
const multer = require("multer");
const path = require('path');
const Config = require('../config/index');
const UserController = require('../controllers/user.controller');
const { userAuthMiddleWare } = require("../middleware/auth.middleware");
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const S3Service = require("../services/s3.service");

var s3 = S3Service.getS3Object()
var storage = multerS3({
    s3: s3,
    bucket: Config.s3Config.bucket,
    metadata: function (req, file, cb) {
        //   cb(null, {fieldName: file.fieldname});
        const datetimestamp = Date.now();
        
        cb(null, { fieldName: 'simform/' + file.fieldname +  datetimestamp + '-' + file.originalname });
    },
    key: function (req, file, cb) {
        const datetimestamp = Date.now();;
        console.log()
        // cb(null, Date.now().toString())
        cb(null,   'simform/' + file.fieldname +  datetimestamp + '-' + file.originalname );
    }
})
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 5 * 1000000 // 5 MB fileSize in bytes
    }
})

router.post("/registerUser", UserController.register);

router.post("/loginUser", UserController.login);

router.post('/updateProfile', userAuthMiddleWare, upload.single('profilePic'), UserController.updateProfile);

router.get('/getUserProfile', userAuthMiddleWare, UserController.getUserProfile);

module.exports = router;