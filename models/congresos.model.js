const mongoose = require('mongoose');

const { Schema } = mongoose;


const congresoSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    date_initial: {
        type: Date,
        required: false,
    },
    date_finish: {
        type: Date,
        required: false,
    },
    hour_initial: {
        type: String,
        required: false,
    },
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
    activo: {
        type: Boolean,
        required: false,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('congresos', congresoSchema);
