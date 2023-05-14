const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy; // import the passport-jwt strategy
const ExtractJwt = require('passport-jwt').ExtractJwt; // import the passport-jwt strategy
const jwt = require('jsonwebtoken'); // import the jsonwebtoken module

const config = require('./config.js'); // import the config.js file


exports.local = passport.use(new LocalStrategy(User.authenticate())); // use the local strategy
passport.serializeUser(User.serializeUser()); // serialize the user
passport.deserializeUser(User.deserializeUser()); // deserialize the user

exports.getToken = user => { // define a function named getToken that takes a user object as a parameter
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}); // return a signed JSON Web Token
}

const opts = {}; // create an empty object named opts
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // specify how JSON Web Tokens should be extracted from the request message
opts.secretOrKey = config.secretKey; // specify the secret key that will be used to verify the signature of the JWT

exports.jwtPassport = passport.use( // use the passport-jwt strategy
    new JwtStrategy( // create a new instance of the passport-jwt strategy
        opts, // specify the options for the strategy
        (jwt_payload, done) => { // specify a callback function that will be used to supply the payload extracted from the JWT to the application
            console.log('JWT payload:', jwt_payload); // log the payload to the console
            User.findOne({_id: jwt_payload._id}, (err, user) => { // use the findOne method to search the database for a user document with the specified ID
                if (err) { // if an error occurs
                    return done(err, false); // return an error and a false value
                } else if (user) { // if the user document is found
                    return done(null, user); // return a null value and the user document
                } else { // if the user document is not found
                    return done(null, false); // return a null value and a false value
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false}); // export the verifyUser method that will be used to verify incoming requests containing JSON Web Tokens
