const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy; // import the passport-jwt strategy
const ExtractJwt = require('passport-jwt').ExtractJwt; // import the passport-jwt strategy
const jwt = require('jsonwebtoken'); // import the jsonwebtoken module
const FacebookTokenStrategy = require('passport-facebook-token'); // import the passport-facebook-token strategy

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

exports.verifyAdmin = (req, res, next) => { // export the verifyAdmin method that will be used to verify incoming requests containing JSON Web Tokens
    if (req.user.admin) { // if the user is an administrator
        return next(); // call the next middleware function
    } else { // if the user is not an administrator
        const err = new Error('You are not authorized to perform this operation!'); // create a new error object
        err.status = 403; // set the status code of the error object to 403
        return next(err); // pass the error object to the next middleware function
    }
};

exports.facebookPassport = passport.use( // use the passport-facebook-token strategy
    new FacebookTokenStrategy( // create a new instance of the passport-facebook-token strategy
        { // specify the options for the strategy
            clientID: config.facebook.clientId, // specify the client ID
            clientSecret: config.facebook.clientSecret // specify the client secret
        },
        (accessToken, refreshToken, profile, done) => { // specify a callback function that will be used to supply the profile extracted from the access token to the application
            User.findOne({facebookId: profile.id}, (err, user) => { // use the findOne method to search the database for a user document with the specified Facebook ID
                if (err) { // if an error occurs
                    return done(err, false); // return an error and a false value
                }
                if (!err && user !== null) { // if no error occurs and the user document is found
                    return done(null, user); // return a null value and the user document
                } else { // if no error occurs and the user document is not found
                    user = new User({username: profile.displayName}); // create a new user document with the specified username
                    user.facebookId = profile.id; // set the facebookId field of the user document to the specified Facebook ID
                    user.firstname = profile.name.givenName; // set the firstname field of the user document to the specified first name
                    user.lastname = profile.name.familyName; // set the lastname field of the user document to the specified last name
                    user.save((err, user) => { // save the user document to the MongoDB database
                        if (err) { // if an error occurs
                            return done(err, false); // return an error and a false value
                        } else { // if no error occurs
                            return done(null, user); // return a null value and the user document
                        }
                    })
                }
            });
        }
    )
);
