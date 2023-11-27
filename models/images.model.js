const mongoose = require('mongoose')

const {Schema} = mongoose;

const imagesModel = new Schema({
    urlFile: {
        type: String,
        required:false

    },
}, {
    timestamps: true
})
module.exports = mongoose.model('images', imagesModel)
