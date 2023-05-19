const express = require('express');
const User = require('../models/user');``
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

const router = express.Router();
/* GET users listing. */
router.get('/', cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find()
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    })
    .catch(err => next(err));
});

router.post('/signup', cors.corsWithOptions, (req, res) => { // use the router.route method to chain all routing methods together
    User.register( // use the User model to register a new user
        new User({username: req.body.username}), // create a new user with the specified username
        req.body.password, // specify the password for the new user
        (err, user) => { // use a callback function to handle any errors
            if (err) { // if an error occurs
                res.statusCode = 500; // set the status code to 500 (Internal Server Error) 
                res.setHeader('Content-Type', 'application/json'); // set the Content-Type header to application/json
                res.json({err: err}); // return a JSON-formatted response with the error details
            } else { // if no error occurs
                if (req.body.firstname) { // if the request body contains a firstname property
                    user.firstname = req.body.firstname; // set the firstname property of the user document to the value of the firstname property in the request body
                }
                if (req.body.lastname) { // if the request body contains a lastname property
                    user.lastname = req.body.lastname; // set the lastname property of the user document to the value of the lastname property in the request body
                }
                user.save(err => { // save the user document to the MongoDB database
                    if (err) { // if an error occurs
                        res.statusCode = 500; // set the status code to 500 (Internal Server Error)
                        res.setHeader('Content-Type', 'application/json'); // set the Content-Type header to application/json
                        res.json({err: err}); // return a JSON-formatted response with the error details
                        return;
                    }

                });
                passport.authenticate('local')(req, res, () => { // authenticate the user
                    res.statusCode = 200; // set the status code to 200 (OK)
                    res.setHeader('Content-Type', 'application/json'); // set the Content-Type header to application/json
                    res.json({success: true, status: 'Registration Successful!'}); // return a JSON-formatted response indicating that the registration was successful
                });
            }
        }
    )
});

router.post('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => { // use the router.route method to chain all routing methods together.
    const token = authenticate.getToken({_id: req.user._id}); // generate a token for the user
    res.statusCode = 200; // set the status code to 200 (OK)
    res.setHeader('Content-Type', 'application/json'); // set the Content-Type header to application/json
    res.json({success: true, token: token, status: 'You are successfully logged in!'}); // return a JSON-formatted response indicating that the user was successfully logged in

});

router.get('/logout',cors.corsWithOptions, (req, res, next) => { // use the router.route method to chain all routing methods together
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
