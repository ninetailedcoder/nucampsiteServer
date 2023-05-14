const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { // define the username field
        type: String, // set the data type to String
        required: true, // set the field to be required
        unique: true, // set the field to be unique
    },
    password: { // define the password field
        type: String, // set the data type to String
        required: true // set the field to be required
    },
    admin: { // define the admin field
        type: Boolean, // set the data type to Boolean
        default: false // set the default value to false
    }
});

module.exports = mongoose.model('User', userSchema); // export the model named User based on the userSchema schema