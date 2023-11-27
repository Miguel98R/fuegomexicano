const mongoose = require('mongoose');

const {Schema} = mongoose;

const calendarDatesSchema = new Schema({
    mes: {
        type: String,
        required: true,
    },
    events: [{
        _id: false,
        date: String,
        location: String,
    }],

}, {
    timestamps: true
})

module.exports = mongoose.model('calendarDates', calendarDatesSchema)
