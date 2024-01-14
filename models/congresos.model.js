const mongoose = require('mongoose');

const { Schema } = mongoose;


const congresoSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    dates: Array,
    location: {
        type: String,
        required: false,
    },
    link_boletos: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('congresos', congresoSchema);
