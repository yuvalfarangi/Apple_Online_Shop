const express = require("express");
const router = express.Router();
const AppError = require("../AppError");
const DBcart_item = require('../DBmodels/cart').DBcart_item;
const DBstore_item = require('../DBmodels/store_items');
const DBorder = require('../DBmodels/orders');
const DBuser = require('../DBmodels/user');
router.use(express.urlencoded({ extended: true }));
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}


router.get("/search", wrapAsync(async (req, res, next) => {
    const q = req.query.q.trim();
    console.log(q)
    const foundItems = await DBstore_item.find({
        displayName: { $regex: new RegExp(q, 'i') }
    });
    const groupedItems = {};

    for (let item of foundItems) {
        const category = item.category;
        if (!groupedItems[category]) {
            groupedItems[category] = [];
        }
        groupedItems[category].push(item);
    }
    res.render("search", { q, founditems: groupedItems });
}));

router.get("/:id", wrapAsync(async (req, res, next) => {
    const item = await DBstore_item.findById(req.params.id).exec();
    if (!item) {
        throw new AppError(404, "Item not found in database");
    }
    res.render("viewItem", { item });
}));

router.get("/", wrapAsync(async (req, res) => {
    if (!req.session.tempCart) req.session.tempCart = [];
    const items = await DBstore_item.find({});
    const groupedItems = {};

    for (let item of items) {
        const category = item.category;
        if (!groupedItems[category]) {
            groupedItems[category] = [];
        }
        groupedItems[category].push(item);
    }

    let items_in_cart;
    if (req.session.userID) {
        const loggedInUser = await DBuser.findById(req.session.userID);
        items_in_cart = loggedInUser.cart_items.length;
    } else {
        items_in_cart = req.session.tempCart.length;
    }

    res.render("shop", { items: groupedItems, items_in_cart });
}));



module.exports = router;