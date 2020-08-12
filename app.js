require('dotenv').config();
const path = require('path');
const express = require('express');
const logger = require('morgan');
var cloudinary = require('cloudinary').v2;
// This is your real test secret API key.
const stripe = require("stripe")("sk_test_51HFFbhD3z2xk99i7hBj9sXo4Vb6r5Ga9cBeecVQcnBOktdRe5QSqTo7zLZhMWtsLbXMQGNSTczhCznuhvHZyecga00e2voFJFq");


if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
  console.warn('!! cloudinary config is undefined !!');
  console.warn('export CLOUDINARY_URL or set dotenv file');
} else {
  console.log('cloudinary config:');
  console.log(cloudinary.config());
}

// Used to setthe favicon for our app
// const favicon = require('serve-favicon');

const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false); //It is to avoid some mongoose functions deprecation

// Database connection
require('./configs/db.config');

const app = express();

app.use(express.static("."));
app.use(express.json());
// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'public')));

// setting up the middleware to let it know where to find the favicon icon
// app.use(favicon(path.join(__dirname, 'public')));

// Logging requests
app.use(logger('dev'));

// Parsing of forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies and sessions
app.use(cookieParser());

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 
app.use(session({
  secret: 'so-hungry',
  cookie: {
    maxAge: 60*60*24*1000*7 // 1week
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60*60*24*7 // 1 week
  
  })
}));

// Routers
const indexRouter = require('./routes/index.routes');
const userRouter = require('./routes/user.routes');
const businessRouter = require('./routes/business.routes');
const photosRouter = require('./routes/photo.routes');

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};
app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.use('/', indexRouter);
app.use('/photos', photosRouter);

// const userRouter = require('./routes/user.routes');
// const businessRouter = require('./routes/business.routes');

//Private routes
/*Rest to privaticed each (business and customer) one of the other*/
app.use((req,res,next)=>{
  req.session.loggedInUser ? next() : res.redirect("/"); 
});


app.use('/user', userRouter);
app.use('/business', businessRouter);

module.exports = app;