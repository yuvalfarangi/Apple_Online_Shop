const express = require("express");
const app = express();
const session = require('express-session');
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");

const cartRoute = require('./routes/cart');
const itemsRoute = require('./routes/item');
const ordersRoute = require('./routes/order');
const pageNavigatorRoute = require('./routes/pageNavigator');
const accountRoute = require('./routes/account');

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use('/orders', ordersRoute);
app.use('/cart', cartRoute);
app.use('/items', itemsRoute);
app.use('/', accountRoute);
app.use('/', pageNavigatorRoute);


app.use((err, req, res, next) => {
    const { status = 500, msg = "ERROR" } = err;
    console.log(msg, err);
    res.status(status).render('alertScreen', { title1: "Something went wrong...", title2: "try again later" });
})


mongoose.connect('mongodb://127.0.0.1:27017/AppleSiteDB')
    .then(() => { console.log("connected to AppleSiteDB") })
    .catch((e) => { console.log("ERROR connected to AppleSiteDB", e) })


app.listen('300', () => {
    console.log("listening on port 300");
})
