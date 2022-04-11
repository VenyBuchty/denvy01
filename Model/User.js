const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { urlencoded } = require('express');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        index: { unique: true },
    },
    email: {
        type: String
    },
    passwort: {
        type: String,
        required: true
    },
    registered: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: '../img/user-default.png'
    },
    ausfluege: {
        type: Array
    }

})

UserSchema.pre('save', function (next) {
    const user = this
    if (this.isModified('passwort') || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
            if (saltError) {
                return next(saltError)
            } else {
                bcrypt.hash(user.passwort, salt, function (hashError, hash) {
                    if (hashError) {
                        return next(hashError)
                    }
                    user.passwort = hash
                    next()
                })
            }
        })
    } else {
        return next()
    }
})


const User = mongoose.model('User', UserSchema);

module.exports = User;