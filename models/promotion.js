const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose); // import the mongoose-currency module
const Currency = mongoose.Types.Currency; // create a variable to store the Currency type

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image:{
        type:String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    description:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;

