const express = require('express');
const Promotion = require('../models/promotion'); // import the Promotion model
const promotionRouter = express.Router(); // create a new Express router
promotionRouter.route('/') // use the router.route method to chain all routing methods together

.get((req, res, next) => {
    Promotion.find() // use the Promotion model to retrieve all promotions from the MongoDB database
    .then(promotions => { // use a promise method to handle the returned promotions
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})
.post((req, res,next) => {
    Promotion.create(req.body) // use the Promotion model to create a new promotion document in the MongoDB database
    .then(promotion => { // use a promise method to handle the returned promotion
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})

.delete((req, res, next) => {
    Promotion.deleteMany() // use the Promotion model to delete all promotions from the MongoDB database
    .then(response => { // use a promise method to handle the returned response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
});


promotionRouter.route('/:promotionId') // use the router.route method to chain all routing methods together

.get((req, res, next) => {
    Promotion.findById(req.params.promotionId) // use the Promotion model to retrieve a specific promotion from the MongoDB database
    .then(promotion => { // use a promise method to handle the returned promotion
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})

.put((req, res,next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, { // use the Promotion model to update a specific promotion in the MongoDB database
        $set: req.body
    }, { new: true })
    
    .then(promotion => { // use a promise method to handle the returned promotion
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.delete((req, res,next) => {
    Promotion.findByIdAndDelete(req.params.promotionId) // use the Promotion model to delete a specific promotion from the MongoDB database
    .then(response => { // use a promise method to handle the returned response

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response); // send the JSON-formatted data as a response to the client
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

module.exports = promotionRouter; // export the router

