const express = require('express');
const User = require('../models/user');``
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => { // use the router.route method to chain all routing methods together
  User.findOne({username: req.body.username}) // use the User model to check if a user with the specified username already exists in the MongoDB database
  .then(user => { // use a promise method to handle the returned user 
      if (user) { // if a user with the specified username already exists in the MongoDB database
          const err = new Error(`User ${req.body.username} already exists!`); // create a new error
          err.status = 403; // set the error status code to 403 (Forbidden)
          return next(err); // pass the error to the Express error handler
      } else { // if a user with the specified username does not already exist in the MongoDB database
          User.create({ // use the User model to create a new user document in the MongoDB database
              username: req.body.username, // set the username
              password: req.body.password // set the password
          })
          .then(user => { // use a promise method to handle the returned user
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({status: 'Registration Successful!', user: user}); // send a JSON response back to the client
          }
          )
          .catch(err => next(err)); // pass any errors to the Express error handler
      }
  })
  .catch(err => next(err)); // pass any errors to the Express error handler
});

router.post('/login', (req, res, next) => { // use the router.route method to chain all routing methods together
  if (!req.session.user) { // if the user is not already logged in
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const password = auth[1];

    User.findOne({username: username}) // use the User model to find a user with the specified username in the MongoDB database
    .then(user => { // use a promise method to handle the returned user
        if (!user) { // if a user with the specified username does not exist in the MongoDB database
            const err = new Error(`User ${username} does not exist!`); // create a new error
            err.status = 401; // set the error status code to 401 (Unauthorized)
            return next(err); // pass the error to the Express error handler
        } else if (user.password !== password) { // if the password provided by the client does not match the password stored in the MongoDB database
            const err = new Error('Your password is incorrect!'); // create a new error
            err.status = 401; // set the error status code to 401 (Unauthorized)
            return next(err); // pass the error to the Express error handler
        } else if (user.username === username && user.password === password) { // if the username and password provided by the client match the username and password stored in the MongoDB database
            req.session.user = 'authenticated'; // set the session user to 'authenticated'
            res.statusCode = 200; // set the status code to 200 (OK)
            res.setHeader('Content-Type', 'text/plain'); // set the Content-Type header to text/plain
            res.end('You are authenticated!'); // send the response
        }
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
  } else { // if the user is already logged in
          res.statusCode = 200; // set the status code to 200 (OK)
          res.setHeader('Content-Type', 'text/plain'); // set the Content-Type header to text/plain
          res.end('You are already authenticated!'); // send the response
      } 
});

router.get('/logout', (req, res, next) => { // use the router.route method to chain all routing methods together
  if (req.session) { // if the session exists
      req.session.destroy(); // destroy the session
      res.clearCookie('session-id'); // clear the session cookie
      res.redirect('/'); // redirect the user to the home page
  } else { // if the session does not exist
      const err = new Error('You are not logged in!'); // create a new error
      err.status = 401; // set the error status code to 401 (Unauthorized)
      return next(err); // pass the error to the Express error handler
  }
});



module.exports = router;
