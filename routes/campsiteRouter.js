const express = require('express');
const campsiteRouter = express.Router(); // create a new Express router
campsiteRouter.route('/') // use the router.route method to chain all routing methods together
.all((req, res, next) => { 
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // pass control of the application routing to the next relevant routing method after this one
})
// use app.all to handle all HTTP verbs
.get((req, res) => { 
    res.end('Will send all the campsites to you');
})// use app.get to handle GET requests

.post((req, res) => {
    res.end(`Will add the campsite: ${req.body.name} with description: ${req.body.description}`);
}) // use app.post to handle POST requests

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})// use app.put to handle PUT requests

.delete((req, res) => {
    res.end('Deleting all campsites');
}); // use app.delete to handle DELETE requests

campsiteRouter.route('/:campsiteId') // use the router.route method to chain all routing methods together
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // pass control of the application routing to the next relevant routing method after this one
})

.get((req, res) => {
    res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`);
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})

.put((req, res) => {
    res.write(`Updating the campsite: ${req.params.campsiteId}\n`); // use res.write to write a line to the reply message
    res.end(`Will update the campsite: ${req.body.name} 
        with description: ${req.body.description}`);
})

.delete((req, res) => {
    res.end(`Deleting campsite: ${req.params.campsiteId}`);
})

module.exports = campsiteRouter; // export the router