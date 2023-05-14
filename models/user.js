const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    admin: { // define the admin field
        type: Boolean, // set the data type to Boolean
        default: false // set the default value to false
    },
    firstname: { // define the firstname field
        type: String, // set the data type to String
        default: '' // set the default value to an empty string
    },
    lastname: { // define the lastname field
        type: String, // set the data type to String
        default: '' // set the default value to an empty string
    }
});

userSchema.plugin(passportLocalMongoose); // use the passport-local-mongoose plugin
module.exports = mongoose.model('User', userSchema); // export the model named User based on the userSchema schema