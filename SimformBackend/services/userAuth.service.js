const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Config = require("../config/index");
const SALT_WORK_FACTOR = Config.BCRYPT_SALT;
class UserAuthService {
    /**
     * It will take the data and return the jwt token
     * @param {any} data
     * @param {String} secreteKey
     * @param {String} expireDuration
     */
    static async generateUserAccessToken(data, secreteKey, expireDuration = "1h") {
        return jwt.sign(data, secreteKey, { expiresIn: expireDuration });
    }

    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        // @ts-ignore
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    /**
     * Take user token and verified it
     * @param { String} token
     * @param { String } secretKey
     */
    static verifyUserAccessToken(token, secretKey) {
        return new Promise((res, rej) => {
            jwt.verify(token, secretKey, (err, data) => {
                if (err) {
                    return rej(err);
                }
                res(data);
            });
        });
    }

    /**
     * Get the user object by email
     * @param {String} email
     * @returns {Promise<import('../models/user.model').IUserSchema>}
     */
    static async getUserByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    /**
     * This will create the user
     * @param {{email:String, password:String, firstName: String, lastName: String}} params0
     * @returns {Promise<import('../models/user.model').IUserSchema>}
     */
    static async createUser({ email, password, firstName, lastName }) {
        try {
            const createdUser = new UserModel({ email, password, firstName, lastName });
            // @ts-ignore
            return await createdUser.save();
        } catch (error) {
            throw error;
        }
    }




    /**
     * 
     * @param {String} _id 
     * @returns {Promise<import('../models/user.model').IUserSchema>}
     */
    static async getUserById(_id) {
        try {
            return await UserModel.findById(_id).lean();
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {String} _id 
     * @param {String} password 
     * @returns {Promise<import('../models/user.model').IUserSchema>} 
     */
    static async setUserPassword(_id, password) {
        try {
            const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
            const hashPassword = await bcrypt.hash(password, salt);
            return await UserModel.findByIdAndUpdate(_id, { password: hashPassword });
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {String} userObjectId 
     * @param {{password?: String, firstName?: String, lastName?: String, profileImage?: String}} updateObject 
     */
    static async updateProfile(userObjectId, updateObject) {
        try {
            return await UserModel.findByIdAndUpdate({_id: userObjectId}, updateObject, {new: true});
        } catch (error) {
            throw error;
        }
    }


}

module.exports = UserAuthService;