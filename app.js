var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session'); // import the express-session middleware
const FileStore = require('session-file-store')(session); // import the session-file-store middleware

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
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({ 
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: 'false',
  resave: 'false',
  store: new FileStore()
})) // use the express-session middleware

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next) {
    console.log(req.session);
    if (!req.session.user) {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    } else {
        if (req.session.user === 'authenticated') {
            return next();
        } else {
            const err = new Error('You are not authenticated!');
            err.status = 401;
            return next(err);
        }
    }
}

app.use(auth); // use the auth middleware function to intercept all incoming requests

app.use(express.static(path.join(__dirname, 'public')));

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
