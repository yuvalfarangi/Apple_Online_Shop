const mongoose = require("mongoose");
const { cartSchema } = require('./cart.js');

const orderSchema = new mongoose.Schema({
    products: { type: [cartSchema], required: true },
    customer: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        userID: { type: String, required: true },
        Address: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        OrderNotes: { type: String, required: false }
    }
});

const DBorder = mongoose.model('Order', orderSchema);

module.exports = DBorder;

