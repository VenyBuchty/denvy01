const mongoose = require('mongoose');
const { userImgUpdate } = require('../controllers/user');
const Schema = mongoose.Schema;

const AusflugSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    datum: {
        type: Date,
        required: true
    },
    friends: {
        type: String
    },
    weather: {
        type: String
    },
    temp: {
        type: String
    },
    ort: {
        type: String,
        required: true
    },
    bilder: [{
        url: String,
        ausflugID: String,
        publicID: String
    }],
    ereignisse: {
        type: String
    },
    notiz: {
        type: String
    },
    erstellt: {
        type: Date,
        default: Date.now
    },
    userID: {
        type: String,
        required: true
    }

})

const Ausflug = mongoose.model('Ausflug', AusflugSchema);

module.exports = Ausflug;