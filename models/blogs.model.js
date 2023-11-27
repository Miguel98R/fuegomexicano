const mongoose = require('mongoose');

const {Schema} = mongoose;

const imagesModel = require('./images.model')


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
        type: Schema.Types.ObjectId,
        ref: imagesModel,
        required: false
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('blogs', blogSchema)
