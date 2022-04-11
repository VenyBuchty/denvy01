const express = require('express');
const { validationResult } = require('express-validator');
const session = require('express-session');
const cloudinary = require('cloudinary');
const Ausflug = require('../Model/Ausflug');



exports.ausflugCreate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(
            { errors: errors.array() }
        );
    } else {
        let userID = req.session.username
        req.body.userID = userID;
        let ausflug = await Ausflug.create(req.body)
        return res.status(200).send(ausflug);
    }
}

exports.ausflugImgUpload = (req, res) => {
    const imgFile = req.files.image;
    cloudinary.v2.uploader.upload(imgFile.path,
        {
            folder: 'ausfluege_imgs/' + req.session.username + '/ausflug_' + req.body.ausflugID + '/'
        },
        function (error, result) {
            if (result.url) {
                Ausflug.findOneAndUpdate(
                    { _id: req.body.ausflugID },
                    {
                        $push: {
                            bilder: {
                                url: result.url,
                                ausflugID: req.body.ausflugID,
                                publicID: result.public_id
                            }
                        }
                    },
                    function (err, done) {
                        if (!err) {
                            res.status(201)
                            res.redirect('/detail?id=' + req.body.ausflugID)
                        } else {
                            res.status(500).json({ error: error });
                        }
                    }
                )
            } else {
                res.status(500).json({ error: error });
            }
        });

}

exports.ausflugImgDelete = (req, res) => {
    Ausflug.findOneAndUpdate(
        { _id: req.body.ausflugID },
        { "$pull": { "bilder": { "publicID": req.body.publicID } } }, { safe: true, multi: true }, function (error, result) {
            if (result) {
                cloudinary.v2.uploader.destroy(req.body.publicID, function (error, result) {
                    console.log(result, error)
                })
                return res.status(200).send(result)
            } else {
                return res.status(400).send(error);
            }
        })

}

exports.ausfluegeListe = (req, res) => {
    Ausflug.find({ userID: req.session.username }, function (err, ausflug) {
        if (err) {
            return res.status(400).send(err);
        } else {
            return res.status(200).send(ausflug);
        }
    });
}

exports.ausflugDetail = (req, res) => {
    Ausflug.findOne({ _id: req.params.ausflugID }, function (err, ausflug) {
        if (err) {
            return res.status(400).send(err);
        } else {
            return res.status(200).send(ausflug);
        }
    });
}

exports.ausflugUpdate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(
            { errors: errors.array() }
        )
    } else {
        try {
            const update = { title: req.body.title, datum: req.body.datum, friends: req.body.friends, weather: req.body.weather, ort: req.body.ort, ereignisse: req.body.ereignisse, notiz: req.body.notiz }
            const filter = { _id: req.body._id }
            const updatedAusflug = await Ausflug.findOneAndUpdate(filter, update, { new: true });
            return res.status(200).send(updatedAusflug);
        } catch (error) {
            res.status(404).send(error);
        }
    }
}


exports.ausflugDelete = async (req, res) => {
    try {
        const ausflugToDelete = req.params.ausflugID;
        const deletedAusflug = await Ausflug.findOneAndRemove({ _id: ausflugToDelete })
        cloudinary.v2.api.delete_resources_by_prefix('ausfluege_imgs/' + req.session.username + '/ausflug_' + req.params.ausflugID + '/', function (error, result) {
            if (result) {
                cloudinary.v2.api.delete_folder('ausfluege_imgs/' + req.session.username + '/ausflug_' + req.params.ausflugID, function (error, result) {
                    
                });
            } else {
                res.status(500).json({ error: error });
            }
        });
        return res.status(200).send(deletedAusflug)
    } catch (error) {
        res.status(404).send(error);
    }
}
