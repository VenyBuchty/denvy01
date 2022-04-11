const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multipart = require('connect-multiparty');
const {
    ausflugCreate,
    ausflugImgUpload,
    ausflugImgDelete,
    ausfluegeListe,
    ausflugDetail,
    ausflugUpdate,
    ausflugDelete
} = require("../controllers/ausflug");


const isLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/anmeldung.html')
    } else {
        next();
    }
}

router.get('/', isLoggedIn, (req, res) => {
    res.redirect('/ausfluege/ausfluege.html')
})

router.use(isLoggedIn); // darunter muss man eingeloggt....
router.use(express.static('views-member'));

/* -----------------------------AUSFLUG CREATE----------------------------- */
router.post('/create', isLoggedIn,
    check('title')
        .isLength({ min: 3 })
        .withMessage('Titel zu kurz (min. 3 Buchstaben)')
        .trim(),
    check('datum')
        .isLength({ min: 3 })
        .withMessage('Füge ein Datum ein'),
    check('ort')
        .isLength({ min: 2 })
        .withMessage('Füge ein Ort ein')
        .trim(),
    ausflugCreate);


router.post('/uploadImgs', multipart(), ausflugImgUpload)

router.post('/deleteImg', ausflugImgDelete)



/* -----------------------------AUSFLUG LISTE ----------------------------- */
router.post('/', isLoggedIn, ausfluegeListe);



/* -----------------------------AUSFLUG DETAIL----------------------------- */

router.get('/detail/:ausflugID', isLoggedIn, ausflugDetail);

/* -----------------------------AUSFLUG UPDATE----------------------------- */
router.get('/update/:ausflugID', isLoggedIn, ausflugDetail)

router.post('/saveupdate',
    check('title')
        .isLength({ min: 3 })
        .withMessage('Titel zu kurz (min. 3 Buchstaben)')
        .trim(),
    check('datum')
        .isLength({ min: 3 })
        .withMessage('Füge ein Datum ein'),
    check('ort')
        .isLength({ min: 2 })
        .withMessage('Füge ein Ort ein')
        .trim(),
    ausflugUpdate);

/* -----------------------------AUSFLUG DELETE----------------------------- */
router.delete('/delete/:ausflugID', isLoggedIn, ausflugDelete);









module.exports = router;