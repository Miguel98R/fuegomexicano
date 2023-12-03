const mongoose = require('mongoose');

const {Schema} = mongoose;



const paymentsSchema = new Schema({
    client_id: {
        type: String,
        required: false,
    },
    id_payment: {
        type: String,
        required: false,
    },
    operation_type: {
        type: String,
        required: false,
    },
    status_order:{
        type: String,
        required: false,
    },
    status_detail:{
        type: String,
        required: false,
    },
    total: {
        type: Number,
        required: false,
    },
    url_payment: {
        type: String,
        required: false,
    },



}, {
    timestamps: true
})

module.exports = mongoose.model('payments', paymentsSchema)