var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const passport = require('passport'); // import passport
const config = require('./config'); // import the config.js file

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter'); // import the uploadRouter module


const mongoose = require('mongoose'); // import mongoose

const url = config.mongoUrl; // set the MongoDB server URL
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

app.all('#', (req, res, next) => {
  if (req.secure) {
    return next();
    } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
      }
      });
      // Secure traffic only']
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));



app.use(passport.initialize()); // initialize Passport

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));

app.use ('/campsites', campsiteRouter);
app.use ('/promotions', promotionRouter);
app.use ('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter); // mount the uploadRouter at the /imageUpload endpoint

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
