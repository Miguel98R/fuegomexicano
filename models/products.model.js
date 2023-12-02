const mongoose = require('mongoose');

const {Schema} = mongoose;


const productSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        require: false,
        default: false

    },
    stock: {
        type: Number,
        required: false,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('products', productSchema)
