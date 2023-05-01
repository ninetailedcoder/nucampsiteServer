const express = require('express');
const promotionRouter = express.Router(); // create a new Express router
promotionRouter.route('/') // use the router.route method to chain all routing methods together
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // pass control of the application routing to the next relevant routing method after this one
})

.get((req, res) => {
    res.end('Will send all the promotions to you');
})

.post((req, res) => {
    res.end(`Will add the promotion: ${req.body.name} with description: ${req.body.description}`);
})

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})

.delete((req, res) => {
    res.end('Deleting all promotions');
})

promotionRouter.route('/:promotionId') // use the router.route method to chain all routing methods together
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // pass control of the application routing to the next relevant routing method after this one
})

.get((req, res) => {
    res.end(`Will send details of the promotion: ${req.params.promotionId} to you`);
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})

.put((req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionId}\n`); // use res.write to write a line to the reply message
    res.end(`Will update the promotion: ${req.body.name} 
        with description: ${req.body.description}`);
})

.delete((req, res) => {
    res.end(`Deleting promotion: ${req.params.promotionId}`);
})

module.exports = promotionRouter; // export the router

