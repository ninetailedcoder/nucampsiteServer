const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({ // create a new multer.diskStorage object
    destination: (req, file, cb) => { // specify the destination folder
        cb(null, 'public/images'); // specify the destination folder as public/images
    },

    filename: (req, file, cb) => { // specify the file name
        cb(null, file.originalname) // specify the file name as the original file name
    }
});

const imageFileFilter = (req, file, cb) => { // create a new function to filter the uploaded files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { // if the uploaded file is not an image file
        return cb(new Error('You can upload only image files!'), false); // return an error
    }
    cb(null, true); // otherwise, return null and true
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter}); // create a new multer object

const uploadRouter = express.Router(); // create a new Express router

uploadRouter.route('/') // mount this router at the / path
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) // use the router.route method to chain all routing methods together
.get(cors.cors,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // use the router.route method to chain all routing methods together
    res.statusCode = 403; // set the status code to 403 (Forbidden)
    res.setHeader('Content-Type', 'text/plain'); // set the Content-Type header to text/plain
    res.end('GET operation not supported on /imageUpload'); // return a message indicating that the GET operation is not supported
})
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile') , (req, res, next) => { // use the router.route method to chain all routing methods together
    res.statusCode = 200; // set the status code to 403 (Forbidden)
    res.setHeader('Content-Type', 'application/json'); // set the Content-Type header to text/plain
    res.json(req.file); // return a message indicating that the GET operation is not supported
})
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // use the router.route method to chain all routing methods together
    res.statusCode = 403; // set the status code to 403 (Forbidden)
    res.setHeader('Content-Type', 'text/plain'); // set the Content-Type header to text/plain
    res.end('Put operation not supported on /imageUpload'); // return a message indicating that the GET operation is not supported
})
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // use the router.route method to chain all routing methods together
    res.statusCode = 403; // set the status code to 403 (Forbidden)
    res.setHeader('Content-Type', 'text/plain'); // set the Content-Type header to text/plain
    res.end('Delete operation not supported on /imageUpload'); // return a message indicating that the GET operation is not supported
})

module.exports = uploadRouter;
