const CONFIG = require('../config/index');
const S3Service = require('../services/s3.service');
const JWT_EXPIRE_DURATION = CONFIG.jwtConfig.expireDuration;
const JWT_SECRETE_KEY = CONFIG.jwtConfig.secreteKey;
const UserAuthService = require('../services/userAuth.service');

exports.register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check For User Collection
        /**
         * @type {import('../models/user.model').IUserSchema}
         */
        let user = await UserAuthService.getUserByEmail(email);
        if (user) {
            const error = new Error(`Email ${user.email} already exists`);
            throw error;
        }

        await UserAuthService.createUser({ email, password, firstName, lastName })
        res.json({ status: true, success: 'User registered successfully' });
    } catch (error) {
        console.log('error', error);
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Parameter are not correct');
        }

        // Getting User
        /**
         * @type {import('../models/user.model').IUserSchema }
         */
        let user = await UserAuthService.getUserByEmail(email);
        /** @type {'admin' | 'subUser'} */
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' })
        }
        if (user.isDeleted) {
            return res.status(404).json({ message: 'User is blocked' });
        }


        // Comparing password and Blocking user
        // @ts-ignore
        const isPasswordCorrect = await user.comparePassword(password);

        if (isPasswordCorrect === false) {
            throw new Error(`email or Password does not match`);
        }


        // Creating Token
        let tokenCreateData;
        tokenCreateData = { email: user.email, adminId: 0, _id: user._id };

        const jwtToken = await UserAuthService.generateUserAccessToken(tokenCreateData, JWT_SECRETE_KEY, JWT_EXPIRE_DURATION);
        // @ts-ignore
        const sendData = user._doc;
        sendData.token = jwtToken;
        delete sendData['password']
        res.status(200).json(sendData);
    } catch (error) {
        next(error);
    }
}


exports.updateProfile = async (req, res, next) => {
    try {
        const { password, firstName, lastName } = req.body;
        const userObjectId = req.user._id;
        const updateData = {};
        if (password) {
            updateData.password = await UserAuthService.hashPassword(password) ;
        }
        if (firstName) {
            updateData.firstName = firstName;
        }
        if (lastName) {
            updateData.lastName = lastName;
        }
        if (req.file) {
            const filePath = req.file.key;
            updateData.profileImage = filePath;
        }

        const updateObjectData = await UserAuthService.updateProfile(userObjectId, updateData);
        if(updateObjectData.profileImage) {
            updateObjectData.profileImage = await S3Service.getImageUrlByKey(updateObjectData.profileImage)
        }
        res.json(updateObjectData);
    } catch (error) {
        next(error);
    }
}

exports.getUserProfile = async (req, res, next) => {
    try {
        const userObjectId = req.user._id;
        let user = await UserAuthService.getUserById(userObjectId);
        if(user) {
           delete user['password']
        }
        if(user.profileImage) {
            user.profileImage = await S3Service.getImageUrlByKey(user.profileImage)
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
}