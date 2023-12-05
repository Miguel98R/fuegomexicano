const mongoose = require('mongoose');

const {Schema} = mongoose;




const blogSchema = new Schema({
    title: {
        type: String,
        required: false,
    },
    subtitle: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    isPublicate: {
        type: Boolean,
        default: false,
    },
    publicationDate: {
        type: Date,
        required: false,
        default: Date.now,

    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('blogs', blogSchema)
