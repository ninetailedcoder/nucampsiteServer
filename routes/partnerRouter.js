const express = require('express');
const Partner = require('../models/partner');
const partnerRouter = express.Router(); // create a new Express router

partnerRouter.route('/') // use the router.route method to chain all routing methods together

.get((req, res, next) => {
    Partner.find() // use the Partner model to retrieve all partners from the MongoDB database
    .then(partners => { // use a promise method to handle the returned partners
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.post((req, res, next) => {
    Partner.create(req.body) // use the Partner model to create a new partner document in the MongoDB database
    .then(partner => { // use a promise method to handle the returned partner
        console.log('Partner Created ', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})

.delete((req, res, next) => {
    Partner.deleteMany() // use the Partner model to delete all partners from the MongoDB database
    .then(response => { // use a promise method to handle the returned response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
});

partnerRouter.route('/:partnerId') // use the router.route method to chain all routing methods together

.get((req, res, next) => {
    Partner.findById(req.params.partnerId) // use the Partner model to retrieve a specific partner from the MongoDB database
    .then(partner => { // use a promise method to handle the returned partner
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})

.put((req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, { // use the Partner model to update a specific partner in the MongoDB database
        $set: req.body
    }, { new: true }) // use the $set operator to update the partner document with the data in the request body
    .then(partner => { // use a promise method to handle the returned partner
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})


.delete((req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId) // use the Partner model to delete a specific partner from the MongoDB database
    .then(response => { // use a promise method to handle the returned response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

module.exports = partnerRouter; // export the router

