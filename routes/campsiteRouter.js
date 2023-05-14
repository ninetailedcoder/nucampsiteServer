const express = require('express');
const Campsite = require('../models/campsite'); // import the Campsite model
const campsiteRouter = express.Router(); // create a new Express router
const authenticate = require('../authenticate'); // import the authenticate module
campsiteRouter.route('/') // use the router.route method to chain all routing methods together
// use app.all to handle all HTTP methods
.get((req, res, next) => { 
    Campsite.find() // use the Campsite model to find all documents in the campsites collection
    .populate('comments.author') // use the populate method to populate the author field in the comments subdocuments with the user document referenced by the ObjectId
    .then(campsites => { // use a promise to handle the returned campsites
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites); // send the campsites back to the client in the response body
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})// use app.get to handle GET requests

.post(authenticate.verifyUser,(req, res, next) => {
    Campsite.create(req.body) // use the Campsite model to create a new campsite document from the request body
    // save current user as the auther of the comment
    .then(campsite => { // use a promise to handle the returned campsite
        console.log('Campsite Created ', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite); // send the campsite back to the client in the response body
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
}) // use app.post to handle POST requests
.put(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})// use app.put to handle PUT requests

.delete(authenticate.verifyUser,(req, res, next) => {
    Campsite.deleteMany() // use the Campsite model to delete all documents in the campsites collection
    .then(response => { // use a promise to handle the returned response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response); // send the response back to the client in the response body
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
}); // use app.delete to handle DELETE requests

campsiteRouter.route('/:campsiteId') // use the router.route method to chain all routing methods together
.get((req, res,next) => {
    Campsite.findById(req.params.campsiteId) // use the Campsite model to find a single campsite document by its _id
    .populate('comments.author') // use the populate method to populate the author field in the comments subdocuments with the user document referenced by the ObjectId
    .then(campsite => { // use a promise to handle the returned campsite
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite); // send the campsite back to the client in the response body
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.post(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})

.put(authenticate.verifyUser,(req, res,next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, { // use the Campsite model to find a single campsite document by its _id and update it
        $set: req.body // use the $set operator to set the campsite document's properties to the values in the request body
    }, { new: true }) // use the { new: true } option to return the updated campsite document to the then() function instead of the original
    .then(campsite => { // use a promise to handle the returned campsite
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite); // send the campsite back to the client in the response body
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.delete(authenticate.verifyUser,(req, res,next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId) // use the Campsite model to find a single campsite document by its _id and delete it
    .then(response => { // use a promise to handle the returned response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response); // send the response back to the client in the response body
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

campsiteRouter.route('/:campsiteId/comments') // use the router.route method to chain all routing methods together
.get((req, res,next) => {
    Campsite.findById(req.params.campsiteId) // use the Campsite model to find a single campsite document by its _id
    .populate('comments.author') // use the populate method to populate the author field in the comments subdocuments with the user document referenced by the ObjectId
    .then(campsite => { // use a promise to handle the returned campsite
        if (campsite) { // check if the campsite document exists
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments); // send the campsite's comments back to the client in the response body
        } else { // if the campsite document doesn't exist
            err = new Error(`Campsite ${req.params.campsiteId} not found`); // create a new error
            err.status = 404;
            return next(err); // pass the error to the Express error handler
        }
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.post(authenticate.verifyUser,(req, res,next) => {
    Campsite.findById(req.params.campsiteId) // use the Campsite model to find a single campsite document by its _id
    .then(campsite => { // use a promise to handle the returned campsite
        if (campsite) { // check if the campsite document exists
            req.body.author = req.user._id; // add the user's _id to the request body
            campsite.comments.push(req.body); // push the new comment onto the campsite's comments array
            campsite.save() // save the updated campsite document to the database
            .then(campsite => { // use a promise to handle the returned campsite
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite); // send the updated campsite back to the client in the response body
            })
            .catch(err => next(err)); // pass any errors to the Express error handler
        } else { // if the campsite document doesn't exist
            err = new Error(`Campsite ${req.params.campsiteId} not found`); // create a new error
            err.status = 404;
            return next(err); // pass the error to the Express error handler
        }
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.put(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})

.delete(authenticate.verifyUser,(req, res,next) => {
    Campsite.findById(req.params.campsiteId) // use the Campsite model to find a single campsite document by its _id
    .then(campsite => { // use a promise to handle the returned campsite
        if (campsite) { // check if the campsite document exists
            for (let i = (campsite.comments.length-1); i >= 0; i--) { // loop through the campsite's comments array in reverse order
                campsite.comments.id(campsite.comments[i]._id).remove(); // remove each comment document from the campsite's comments subdocument array
            }
            campsite.save() // save the updated campsite document to the database
            .then(campsite => { // use a promise to handle the returned campsite
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite); // send the updated campsite back to the client in the response body
            })
            .catch(err => next(err)); // pass any errors to the Express error handler
        } else { // if the campsite document doesn't exist
            err = new Error(`Campsite ${req.params.campsiteId} not found`); // create a new error
            err.status = 404;
            return next(err); // pass the error to the Express error handler
        }
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
});

campsiteRouter.route('/:campsiteId/comments/:commentId') // use the router.route method to chain all routing methods together
.get((req, res,next) => {
    Campsite.findById(req.params.campsiteId) // use the Campsite model to find a single campsite document by its _id
    .populate('comments.author') // use the populate method to populate the author field in the comments subdocuments with the user document referenced by the ObjectId
    .then(campsite => { // use a promise to handle the returned campsite
        if (campsite && campsite.comments.id(req.params.commentId)) { // check if the campsite document exists and the comment subdocument exists
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments.id(req.params.commentId)); // send the comment back to the client in the response body
        } else if (!campsite) { // if the campsite document doesn't exist
            err = new Error(`Campsite ${req.params.campsiteId} not found`); // create a new error
            err.status = 404;
            return next(err); // pass the error to the Express error handler
        } else { // if the comment subdocument doesn't exist
            err = new Error(`Comment ${req.params.commentId} not found`); // create a new error
            err.status = 404;
            return next(err); // pass the error to the Express error handler
        }
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.post(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`);
})

.put(authenticate.verifyUser,(req, res,next) => {
    Campsite.findById(req.params.campsiteId) // use the Campsite model to find a single campsite document by its _id
    .then(campsite => { // use a promise to handle the returned campsite
        if (campsite && campsite.comments.id(req.params.commentId)) { // check if the campsite document exists and the comment subdocument exists
            if (req.body.rating) { // check if the client sent a rating in the request body
                campsite.comments.id(req.params.commentId).rating = req.body.rating; // update the comment document's rating field with the new rating
            }
            if (req.body.text) { // check if the client sent a text in the request body
                campsite.comments.id(req.params.commentId).text = req.body.text; // update the comment document's text field with the new text
            }
            campsite.save() // save the updated campsite document to the database
            .then(campsite => { // use a promise to handle the returned campsite
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite); // send the updated campsite back to the client in the response body
            })
            .catch(err => next(err)); // pass any errors to the Express error handler
        } else if (!campsite) { // if the campsite document doesn't exist
            err = new Error(`Campsite ${req.params.campsiteId} not found`); // create a new error
            err.status = 404;
            return next(err); // pass the error to the Express error handler
        } else { // if the comment subdocument doesn't exist
            err = new Error(`Comment ${req.params.commentId} not found`); // create a new error
            err.status = 404;
            return next(err); // pass the error to the Express error handler
        }
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
})

.delete(authenticate.verifyUser,(req, res,next) => {
    Campsite.findById(req.params.campsiteId) // use the Campsite model to find a single campsite document by its _id
    .then(campsite => { // use a promise to handle the returned campsite
        if (campsite && campsite.comments.id(req.params.commentId)) { // check if the campsite document exists and the comment subdocument exists
            campsite.comments.id(req.params.commentId).remove(); // remove the comment document from the campsite's comments subdocument array
            campsite.save() // save the updated campsite document to the database
            .then(campsite => { // use a promise to handle the returned campsite
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite); // send the updated campsite back to the client in the response body
            })
            .catch(err => next(err)); // pass any errors to the Express error handler
        } else if (!campsite) { // if the campsite document doesn't exist
            err = new Error(`Campsite ${req.params.campsiteId} not found`); // create a new error
            err.status = 404;
            return next
            (err); // pass the error to the Express error handler
        } else { // if the comment subdocument doesn't exist
            err = new Error(`Comment ${req.params.commentId} not found`); // create a new error
            err.status = 404;
            return next(err); // pass the error to the Express error handler
        }
    })
    .catch(err => next(err)); // pass any errors to the Express error handler
});


module.exports = campsiteRouter; // export the router