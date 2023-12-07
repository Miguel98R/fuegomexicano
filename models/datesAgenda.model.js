const mongoose = require('mongoose');

const { Schema } = mongoose;


const DatesAgendaSchema = new Schema({
    date: {
        type: Date,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('DatesAgendas', DatesAgendaSchema);
