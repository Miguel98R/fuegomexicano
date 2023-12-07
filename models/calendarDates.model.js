const mongoose = require('mongoose');

const { Schema } = mongoose;
const datesAgendaModel = require("./datesAgenda.model")

// Enum de los meses del año en español
const mesesEnum = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

const calendarDatesSchema = new Schema({
    mes: {
        type: String,
        required: true,
        enum: mesesEnum,
    },
    active: {
        type: Boolean,
        required: true,
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: datesAgendaModel,
            required: false
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('calendarDates', calendarDatesSchema);
