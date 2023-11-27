const mongoose = require('mongoose');

const {Schema} = mongoose;


const usersSchema = new Schema({
    user_name: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    usersTypes: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('users', usersSchema)
