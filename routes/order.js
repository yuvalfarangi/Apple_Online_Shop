const express = require("express");
const router = express.Router();
const AppError = require("../AppError");
const DBcart_item = require('../DBmodels/cart').DBcart_item;
const DBstore_item = require('../DBmodels/store_items');
const DBorder = require('../DBmodels/orders');
const DBusers = require("../DBmodels/user");
router.use(express.urlencoded({ extended: true }));
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

router.post('/', wrapAsync(async (req, res, next) => {
    const products = JSON.parse(req.body.products);
    if (!products) throw new AppError(500, "no products found to submit an order")
    const { firstName, lastName, Address, email, phoneNumber, OrderNotes, userID } = req.body;

    const orderData = {
        products,
        customer: {
            userID,
            firstName,
            lastName,
            Address,
            email,
            phoneNumber,
            OrderNotes
        }
    };
    await DBorder.insertMany(orderData);
    await DBstore_item.findVariantAndSell(products)
    const user = await DBusers.findById(userID);
    user.cart_items = [];
    user.save();
}));

router.use(express.json())
router.post('/payment', (req, res) => {
    //fake payment check)

    let paymentSuccess;
    const rand = Math.floor(Math.random() * (10) + 1)
    if (rand < 2) { paymentSuccess = true }
    else { paymentSuccess = false }
    res.json({ paymentSuccess });
})


module.exports = router;