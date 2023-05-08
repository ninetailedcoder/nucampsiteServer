var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose'); // import mongoose

const url = 'mongodb://127.0.0.1:27017/nucampsite'; // set the URL for the MongoDB server
const connect = mongoose.connect(url, { 
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true
})// connect to the MongoDB server

connect.then(() => console.log('Connected correctly to server'), // log a message to the console if the connection is successful
  err => console.log(err) // log an error message to the console if the connection is unsuccessful
);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const auth = (req, res, next) => { // create a middleware function named auth
  console.log(req.headers); // log the incoming request headers to the console
  const authHeader = req.headers.authorization; // extract the authorization header from the incoming request
  if (!authHeader) { // if the authorization header is not present in the incoming request
      const err = new Error('You are not authenticated!'); // create a new error object
      res.setHeader('WWW-Authenticate', 'Basic'); // set the response header
      err.status = 401; // set the error status code
      return next(err); // pass the error to the Express error handler
  }
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); // decode the authorization header and extract the username and password
  const user = auth[0]; // extract the username
  const pass = auth[1]; // extract the password
  if (user === 'admin' && pass === 'password') { // if the username and password are correct
      return next(); // call the next middleware function
  } else { // if the username and password are incorrect
      const err = new Error('You are not authenticated!'); // create a new error object
      res.setHeader('WWW-Authenticate', 'Basic'); // set the response header
      err.status = 401; // set the error status code
      return next(err); // pass the error to the Express error handler
  }
}

app.use(auth); // use the auth middleware function to intercept all incoming requests

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use ('/campsites', campsiteRouter);
app.use ('/promotions', promotionRouter);
app.use ('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
