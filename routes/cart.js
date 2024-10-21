const express = require("express");
const router = express.Router();
const AppError = require("../AppError");
const DBcart_item = require('../DBmodels/cart').DBcart_item;
const DBstore_item = require('../DBmodels/store_items');
const DBorder = require('../DBmodels/orders');
const DBuser = require('../DBmodels/user');

router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
    if (!req.session.tempCart) {
        req.session.tempCart = [];
    }
    next();
});

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}


router.delete('/:id', wrapAsync(async (req, res, next) => {
    console.log('DELETE route hit');  // Check if route is hit

    if (req.session.userID) {
        const loggedInUser = await DBuser.findById(req.session.userID);
        if (req.params.id == "all") {
            loggedInUser.cart_items = [];
            await loggedInUser.save();
        }
        else {
            for (let i = 0; i < loggedInUser.cart_items.length; i++) {
                if (loggedInUser.cart_items[i].id == req.params.id) {
                    loggedInUser.cart_items.splice(i, 1);
                    await loggedInUser.save();
                }
            }
        }
    }
    else {
        console.log('not signed in');
        console.log(req.params.id)
        if (req.params.id == "all") {
            req.session.tempCart = [];
        }
        else {
            for (let i = 0; i < req.session.tempCart.length; i++) {
                if (req.session.tempCart[i].id == req.params.id) {
                    req.session.tempCart.splice(i, 1);
                }
            }
        }
    }
    res.redirect("/cart")
}));

router.get('/', wrapAsync(async (req, res) => {
    if (!req.session.tempCart) req.session.tempCart = [];
    let cartitems;
    let loggedInUser;
    if (req.session.userID) {
        loggedInUser = await DBuser.findById(req.session.userID);
        cartitems = loggedInUser.cart_items;
    }
    else {
        cartitems = req.session.tempCart;
    }
    res.render('cart', { cartitems, loggedInUser })
}));


router.post('/', wrapAsync(async (req, res) => {
    console.log("req,body ", req.body)
    if (!req.session.tempCart) req.session.tempCart = [];
    if (await DBstore_item.checkStock(req.body)) {
        const product = await DBcart_item.modifyOrder(req.body);
        if (req.body.image_src.length > 0) product.image_src = req.body.image_src;
        console.log(product);

        if (req.session.userID) {
            const loggedInUser = await DBuser.findById(req.session.userID);
            loggedInUser.cart_items.push(product);
            loggedInUser.save();
        }
        else {
            req.session.tempCart.push(product);
        }
        res.redirect('/items');
    }
    else {
        res.render("alertScreen", { title1: "Product is out of stock", title2: "" })
    }
}));


module.exports = router;