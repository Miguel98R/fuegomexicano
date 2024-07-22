const mongoose = require('mongoose')
const moment = require('moment')

const {Schema} = mongoose;

const shippingModel = require('./userShipping.model')


const suscripcionesSchema = new Schema({


    user_data: {
        type: Schema.Types.ObjectId,
        ref: shippingModel,
        required: false
    },
    plan:{
        type:String,
        required: false
    },
    subscriptionDate: {
        type: Date,
        required: false,
        default: Date.now,

    },

}, {
    timestamps: true
})

module.exports = mongoose.model('suscripciones', suscripcionesSchema)
