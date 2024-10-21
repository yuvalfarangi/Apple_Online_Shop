const express = require("express");
const router = express.Router();
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const AppError = require("../AppError");
const mongoose = require('mongoose');
const DBcart_item = require('../DBmodels/cart').DBcart_item;
const DBstore_item = require('../DBmodels/store_items');
const DBorder = require('../DBmodels/orders');
const DBuser = require('../DBmodels/user');


// Middleware setup
router.use(express.urlencoded({ extended: true }));
router.use(flash());
router.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

let incorrectAlert;

router.get('/account', wrapAsync(async (req, res) => {
    if (req.session.userID) {
        const loggedInUser = await DBuser.findById(req.session.userID);
        if (loggedInUser) {
            incorrectAlert = null;
            res.render('myAccount', { user: loggedInUser, errorMsgs: [], formData: {} });
        }
    } else {
        res.render('account', { incorrectAlert, errorMsgs: [], formData: {} });
    }
}));


router.post('/signup', wrapAsync(async (req, res) => {
    const errorMsgs = await DBuser.validateNewUser(req.body)
    if (errorMsgs.length > 0) {
        res.render('account', { incorrectAlert: "", errorMsgs, formData: req.body })
    }

    else {
        newUserID = await DBuser.addNewUser(req.body);
        req.session.userID = newUserID
        const newUser = await DBuser.findById(newUserID);
        if (req.session.tempCart && req.session.tempCart.length > 0) {
            newUser.cart_items = req.session.tempCart;
            await newUser.save();
            req.session.tempCart = [];
        }
        res.redirect('/account')
    }
}));

router.post('/login', wrapAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await DBuser.findOne({ username });
    if (!user) {
        incorrectAlert = 'Username or password is incorrect.';
        res.redirect('/account')
    }
    else {
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            req.session.userID = user._id;
            if (req.session.tempCart && req.session.tempCart.length > 0) {
                user.cart_items = req.session.tempCart;
                await user.save();
                req.session.tempCart = [];
            }
            res.redirect('/account');
        }
        else {
            incorrectAlert = 'Username or password is incorrect.';
            res.redirect('/account')
        }
    }
}));

router.post('/logout', (req, res) => {
    req.session.userID = null;
    res.redirect('/account');
})

router.put('/account', wrapAsync(async (req, res) => {
    const loggedInUser = await DBuser.findById(req.body.userID);
    const errorMsgs = await DBuser.validateEditedUser(req.body)
    if (errorMsgs.length > 0) {
        res.render('myAccount', { user: loggedInUser, errorMsgs, formData: req.body });
    }
    else {
        await loggedInUser.update(req.body);
        res.redirect('/account')
    }
}))


module.exports = router;