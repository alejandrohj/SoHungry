require('dotenv').config();
const path = require('path');
const express = require('express');
const logger = require('morgan');

// Used to setthe favicon for our app
// const favicon = require('serve-favicon');

const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');

// Database connection
require('./configs/db.config');

const app = express();

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
app.use('/', indexRouter);
const businessRouter = require('./routes/business.routes');
app.use('/', businessRouter);
const userRouter = require('./routes/user.routes');
app.use('/', userRouter);

//Private routes
/*Rest to privaticed each (business and customer) one of the other*/
app.use((req,res,next)=>{
  req.session.loggedInUser ? next() : res.redirect("/"); 
});
//app.use((req,res,next)=>{
  //console.log(req.session.usertype);
  //if(req.session.usertype =='customer') {
    //console.log('userPage');

  //}
  //else if(req.session.usertype =='business') {

  //}
//   else{
//     res.redirect("/")
//     next();}
// });





module.exports = app;