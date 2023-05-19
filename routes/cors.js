const cors = require('cors');
const whitelist = ['http://localhost:3000', 'http://localhost:5000'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if (whitelist.indexOf(req.header('Origin')) !== -1) { // if the incoming request header contains the Origin field and the value of the Origin field is in the whitelist
        corsOptions = { origin: true }; // set the corsOptions variable to an object with the origin field set to true
    }
    else { // otherwise
        corsOptions = { origin: false }; // set the corsOptions variable to an object with the origin field set to false
    }
    callback(null, corsOptions); // call the callback function with null as the error argument and the corsOptions object as the second argument
};

exports.cors = cors(); // use the cors module to enable CORS for all origins
exports.corsWithOptions = cors(corsOptionsDelegate); // use the cors module to enable CORS for a specific origin
