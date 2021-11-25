const db = require("../config/db");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const Config = require("../config/index");
const UserAuthService = require("../services/userAuth.service");
const SALT_WORK_FACTOR = Config.BCRYPT_SALT;

/**
 * @typedef {Object} IUserSchema
 * @property {String} _id
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} email
 * @property {String} password
 * @property {Boolean} [isDeleted]
 * @property {String} [profileImage]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */
const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "email can't be empty"],
        // @ts-ignore
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "email format is not correct",
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
        default: null
    }
}, { timestamps: true });

UserSchema.pre("save", async function () {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        // @ts-ignore
        const hash = await bcrypt.hash(user.password, salt);
        // @ts-ignore
        user.password = hash;
    } catch (error) {
        throw error;
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // @ts-ignore
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

/** @typedef  {IUserSchema & mongoose.Document} UserDocument*/
/** @type {mongoose.Model<UserDocument>} */
// @ts-ignore
const UserModel = db.model("User", UserSchema);
module.exports = UserModel;