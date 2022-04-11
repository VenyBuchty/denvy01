const express = require('express');
const bcrypt = require("bcrypt")
const { validationResult } = require('express-validator');
const session = require('express-session');
const cloudinary = require('cloudinary');
const User = require('../Model/User')
const Ausflug = require('../Model/Ausflug');




/* -----------------------------REGISTER----------------------------- */
exports.userRegister = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(
            { errors: errors.array() }
        );
    } else {
        req.body.username = req.body.username.toLowerCase() //Um Benutzernamen mit groß/klein Variationen vermeiden
        User.find({ username: req.body.username }, (error, data) => {
            if (data) {
                if (data.length > 0) {
                    return res.status(400).json(
                        { errors: [{ param: 'username', msg: 'Benutzername schon vergeben' }] }
                    );
                } else {
                    User.create(req.body).then(function (user) {
                        req.session.isLoggedIn = true;
                        req.session.username = req.body.username;
                        return res.status(200).send(user);
                    });
                }
            } else {
                return res.status(400).send(error)
            }
        })
    }
};


/* -----------------------------LOGIN----------------------------- */
exports.userLogin = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json(
            { errors: errors.array() }
        );
    } else {
        req.body.username = req.body.username.toLowerCase() //Um Benutzernamen mit groß/klein Variationen vermeiden
        User.findOne({ username: req.body.username }, function (error, foundUser) {
            if (!error) {
                if (foundUser) {
                    bcrypt.compare(req.body.passwort, foundUser.passwort, function (error, isMatch) {
                        if (error) {
                            throw error
                        } else if (!isMatch) {
                            return res.status(400).json(
                                { errors: [{ param: 'passwort', msg: 'Benutzername und/oder Passwort nicht richtig' }] })
                        } else {
                            req.session.isLoggedIn = true;
                            req.session.username = foundUser.username;

                            return res.status(200).send({ name: foundUser.name });
                        }
                    })
                } else {
                    return res.status(400).json(
                        { errors: [{ param: 'username', msg: 'Benutzername und/oder Passwort nicht richtig' }] })
                }
            } else {
                return res.status(401).send(error);
            }
        })
    }
}


/* -----------------------------USER INFO----------------------------- */
exports.userInfo = (req, res) => {
    User.findOne({ username: req.session.username }, function (err, user) {
        if (err) {
            return res.status(403).send(err);
        } else {
            return res.status(200).send(user);
        }
    });
}

exports.ausfluegeAnzahl = (req, res) => {
    Ausflug.find({ userID: req.session.username }, function (err, ausflug) {
        if (err) {
            return res.status(403).send(err);
        } else {
            return res.status(200).send(ausflug);
        }
    });
}

/* -----------------------------UPDATE PROFILE----------------------------- */
exports.userBioUpdate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json(
            { errors: errors.array() }
        )
    } else {
        try {
            const update = { name: req.body.name, email: req.body.email }
            const filter = { username: req.session.username }
            const updatedUser = await User.findOneAndUpdate(filter, update, { new: true });
            return res.status(200).send(updatedUser);
            // User.findOneAndUpdate(filter, update, { new: true })
            //     .then(updatedUser => res.status(200).send(updatedUser))
            //     .catch(err => next(err));
        } catch (error) {
            res.status(404).send(error);
        }
    }
}

exports.userImgUpdate = (req, res) => {
    const imgFile = req.files.image;
    cloudinary.v2.uploader.upload(imgFile.path,
        {
            folder: 'users_img/',
            public_id: req.session.username
        },
        async function (error, result) {
            try {
                if (result.url) {
                    const filter = { username: req.session.username }
                    const update = { image: result.url }
                    await User.findOneAndUpdate(filter, update, { new: true });
                    return res.redirect('/user/profileupdate.html')
                } else {
                    res.status(500).json({ error: error });
                }
            } catch (error) {
                res.status(403).send(error);
            }
        }
    )
}

/* -----------------------------UPDATE PASSWORT----------------------------- */
exports.userPswUpdate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json(
            { errors: errors.array() }
        );
    } else {
        User.findOne({ username: req.session.username }, function (error, foundUser) {
            if (foundUser) {
                bcrypt.compare(req.body.passwortAlt, foundUser.passwort, function (err, isMatch) {
                    if (err) {
                        throw err
                    } else if (!isMatch) {
                        return res.status(400).json(
                            { errors: [{ param: 'passwort', msg: 'Altes passwort stimmt nicht' }] })
                    } else {
                        bcrypt.genSalt(10, function (saltError, salt) {
                            if (saltError) {
                                return next(saltError)
                            } else {
                                bcrypt.hash(req.body.passwortNeu, salt, async function (hashError, hash) {
                                    if (hashError) {
                                        return next(hashError)
                                    } else {
                                        try {
                                            const passwort = hash
                                            const update = { passwort: passwort }
                                            const filter = { username: req.session.username }
                                            const pswUpdate = await User.findOneAndUpdate(filter, update, { new: true });
                                            return res.status(200).send(pswUpdate)
                                        } catch (error) {
                                            res.status(404).send(error);
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                return res.status(403).send(error)
            }
        }
        )
    }
}

/* -----------------------------LOGOUT----------------------------- */
exports.userLogout = (req, res) => {
    req.session.isLoggedIn = false;
    req.session.destroy()
    res.status(200).send({ url: '/index.html' })
}

/* -----------------------------DELETE----------------------------- */
exports.userDelete = async (req, res) => {
    try {
        req.session.isLoggedIn = false;
        const userToDelete = req.session.username;
        const deletedUser = await User.findOneAndRemove({ username: userToDelete })
        await Ausflug.deleteMany({ userID: userToDelete })
        await cloudinary.v2.uploader.destroy('users_img/' + req.session.username, function (error, result) {
            console.log(result, error)
        });
        await cloudinary.v2.api.delete_resources_by_prefix('ausfluege_imgs/' + req.session.username + '/ausflug_', function (error, result) {
            if (result) {
                cloudinary.v2.api.delete_folder('ausfluege_imgs/' + req.session.username, function (error, result) {
                    console.log(result, error)
                });
            } else {
                res.status(500).json({ error: error });
            }
        });
        return res.status(200).send(deletedUser)
    } catch (error) {
        res.status(403).send(error);
    }
}