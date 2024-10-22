const express = require("express");
const router = express.Router();
const AppError = require("../AppError");
const DBcart_item = require('../DBmodels/cart').DBcart_item;
const DBstore_item = require('../DBmodels/store_items');
const DBorder = require('../DBmodels/orders');
router.use(express.urlencoded({ extended: true }));
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

router.get("/", (req, res) => {
    res.render("homeScreen");
})

router.get("/iPad", wrapAsync(async (req, res) => {
    const items = await DBstore_item.find({ category: 'iPad' });
    if (!items) throw new AppError(500, "Failed retrive data from database");
    res.render("iPad", { items });
}));

router.get("/AirPods", wrapAsync(async (req, res) => {
    const items = await DBstore_item.find({ category: 'AirPods' });
    if (!items) throw new AppError(500, "Failed retrive data from database");
    res.render("airPods", { items });
}));

router.get('/Home', wrapAsync(async (req, res) => {
    const items = await DBstore_item.find({ category: 'HomeKit' });
    if (!items) throw new AppError(500, "Failed retrive data from database");
    res.render('TVandHome', { items });
}));

router.get('/Mac', wrapAsync(async (req, res) => {
    const items = await DBstore_item.find({ category: 'Mac' });
    if (!items) throw new AppError(500, "Failed retrive data from database");
    res.render('mac', { items });
}));

router.get('/iPhone', wrapAsync(async (req, res) => {
    const items = await DBstore_item.find({ category: 'iPhone' });
    if (!items) throw new AppError(500, "Failed retrive data from database");
    res.render('iphone', { items });
}));


router.use((req, res) => {
    res.status(404).render('alertScreen', { title1: "Oh no, it seems like the page you asked for not found.", title2: "maybe try Samsung website..." })
})


module.exports = router;