const mongoose = require('mongoose');
const DBstore_item = require('./store_items');

const cartSchema = new mongoose.Schema({

    id: { type: String, required: true },
    displayName: { type: String, required: true },
    image_src: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    priceUnit: { type: String, required: true },
    onSale: { type: Boolean, default: false, required: false },
    color: { type: String, required: false },
    storageSize: { type: String, required: false }

});


cartSchema.statics.modifyOrder = async function (req) {
    const selectedItem = await DBstore_item.findById(req.product_id);
    const newItemToCart = {
        id: req.product_id,
        displayName: selectedItem.displayName,
        image_src: selectedItem.image_src,
        price: selectedItem.price,
        priceUnit: selectedItem.priceUnit,
        onSale: selectedItem.onSale
    }
    if (req.color) newItemToCart.color = req.color;
    if (req.storageSize) newItemToCart.storageSize = req.storageSize;
    return newItemToCart;
}

cartSchema.statics.addProduct = async function (product) {
    await DBcart_item.insertMany(product)
}

const DBcart_item = mongoose.model('Cart_item', cartSchema);
module.exports = { DBcart_item, cartSchema };


const cartitems = [
    {
        productID: '66f7c3e66882436795e33f00',
        displayName: 'iPhone 20 pro',
        price: 999,
        priceUnit: '$',
        image_src: '/pictures/iphone/iphone_16_pro.png',
        onSale: false,
        color: 'BlackTitanium',
        storageSize: '256GB'
    },
    {
        productID: '66f7f88fbb5e48d77372a58f',
        displayName: 'HomePod',
        price: 299.9,
        image_src: '/pictures/appleTV&home/HomePod.png',
        priceUnit: '$',
        onSale: false,
        color: 'White'
    },
    {
        productID: '66f69f930d4fed88891a0a4a',
        displayName: 'AirPods Pro',
        image_src: '/pictures/airPods/AirPods_pro.jpeg',
        price: 249,
        priceUnit: '$',
        onSale: false
    }
]