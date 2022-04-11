const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multipart = require('connect-multiparty');
const {
    userRegister,
    userLogin,
    userInfo,
    ausfluegeAnzahl,
    userBioUpdate,
    userImgUpdate,
    userPswUpdate,
    userLogout,
    userDelete
} = require("../controllers/user");




/* --------------------ALLGEMEIN------------------------ */

const isLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/anmeldung.html')
    } else {
        next();
    }
}


router.get('/', isLoggedIn, (req, res) => {
    res.redirect('/ausfluege.html');
})


router.get('/anmeldung', isLoggedIn, (req, res) => {
    res.redirect('/ausfluege.html')
})




/* -----------------------------REGISTER----------------------------- */
router.post("/register",
    check('name')
        .isLength({ min: 3 })
        .withMessage('Name zu kurz (min. 3 Buchstaben)')
        .trim(),
    check('username')
        .isLength({ min: 3 })
        .withMessage('Benutzername zu kurz (min. 3 Buchstaben)')
        .isAlphanumeric()
        .withMessage('Benutzername darf keine Leerzeichen enthalten')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Falsche E-mail syntax')
        .trim(),
    check('passwort')
        .matches(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/)
        .withMessage('Passwort muss mindestens 8 Zeichen enthalten, eine Kombination aus Buchstaben und Zahlen')
        .trim(), userRegister);



/* -----------------------------LOGIN----------------------------- */
router.post('/login',
    check('username')
        .isLength({ min: 3 })
        .withMessage('Ungültiger Benutzername'),
    check('passwort')
        .isLength({ min: 3 })
        .withMessage('Ungültiges Passwort'), userLogin);



/* -----------------------------PROFILE----------------------------- */


router.use(isLoggedIn); // darunter muss man eingeloggt sein....
router.use(express.static('views-member'));

router.get('/profile', isLoggedIn, (req, res) => { // /user/profile
    res.redirect('/user/profile.html')
})
router.post('/profile', userInfo);

router.post('/ausfluegeAnzahl', ausfluegeAnzahl);




/* -----------------------------UPDATE BIO----------------------------- */
router.get('/update', isLoggedIn, (req, res) => {
    res.redirect('/user/profileupdate.html')
})

router.post('/update', isLoggedIn, userInfo)


router.post('/saveupdate',
    check('name')
        .isLength({ min: 3 })
        .withMessage('Name zu kurz (min. 3 Buchstaben)')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Falsche E-mail syntax')
        .trim(),
    userBioUpdate);

/* ----------------------------- UPDATE IMG----------------------------*/

router.get('/upload', (req, res) => {
    res.redirect('/user/profileupdate.html')
})


router.post('/upload', multipart(), userImgUpdate);

/* -----------------------------UPDATE PASSWORT----------------------------- */
router.get('/pswupdate', isLoggedIn, (req, res) => {
    res.redirect('/user/pswupdate.html')
})


router.post('/savepsw',
    check('passwortAlt')
        .not()
        .isEmpty()
        .withMessage('Altes Passwort darf nicht leer sein')
        .trim(),
    check('passwortNeu')
        .not()
        .isEmpty()
        .withMessage('Neues Passwort darf nicht leer sein')
        .trim(),
    check('passwortNeu2')
        .not()
        .isEmpty()
        .withMessage('Neues Passwort 2 darf nicht leer sein')
        .matches(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/)
        .withMessage('Passwort muss mindestens 8 Zeichen enthalten, eine Kombination aus Buchstaben und Zahlen')
        .trim(), userPswUpdate)

/* -----------------------------LOGOUT----------------------------- */
router.post('/logout', userLogout)

/* -----------------------------DELETE----------------------------- */
router.delete('/delete', userDelete);





module.exports = router;
