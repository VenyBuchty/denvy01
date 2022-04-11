// Module
const express = require('express');
const app = express();
const sslRedirect = require('heroku-ssl-redirect');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session)
const userRoute = require('./routes/user');
const ausflugRoute = require('./routes/ausflug');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary');
require('dotenv').config();


// Konstante
const PORT = process.env.PORT || 8000;

// Database
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.log('Database not connected' + err);
})

const store = new MongoDBSession({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

//Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SEC
});

//Session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // = 1 Tag (1 tag * 24 std/1 tag * 60 min/1 std * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));


// Server Basis
app.listen(PORT, () => { console.log('Server running. All OK.') });


// Middleware
app.use(cookieParser())
app.use(sslRedirect.default()); // jeder http Request an HEROKU wird auf https umgeleitet
app.use(express.static('views',
    { extensions: ['html', 'htm'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // bodyparser, Daten aus Req-Body auslesen

// User Registration + Login
app.use('/user', userRoute);
// Ausfluge verwaltung
app.use('/ausfluege', ausflugRoute)


app.get('*', (req, res) => {
    res.redirect('/anmeldung.html')
})
















