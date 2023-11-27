const mongoose = require('mongoose');

const {Schema} = mongoose;

const invitacionesSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    responsabilidad: {
        type: String,
        required: true,
    },
    ministerio: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    numeroContacto: {
        type: String,
        required: true,
    },
    fechaEvento: {
        type: Date,
        required: true,
    },
    numeroPersonasEsperadas: {
        type: Number,
        required: true,
    },
    descripcionEvento: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('invitaciones', invitacionesSchema)
