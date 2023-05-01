const express = require('express');
const partnerRouter = express.Router(); // create a new Express router

partnerRouter.route('/') // use the router.route method to chain all routing methods together

.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // pass control of the application routing to the next relevant routing method after this one
})

.get((req, res) => {
    res.end('Will send all the partners to you');
})

.post((req, res) => {
    res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`);
})

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})

.delete((req, res) => {
    res.end('Deleting all partners');
})

partnerRouter.route('/:partnerId') // use the router.route method to chain all routing methods together

.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // pass control of the application routing to the next relevant routing method after this one
})

.get((req, res) => {
    res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})

.put((req, res) => {
    res.write(`Updating the partner: ${req.params.partnerId}\n`); // use res.write to write a line to the reply message
    res.end(`Will update the partner: ${req.body.name} 
        with description: ${req.body.description}`);
})

.delete((req, res) => {
    res.end(`Deleting partner: ${req.params.partnerId}`);
})

module.exports = partnerRouter; // export the router

