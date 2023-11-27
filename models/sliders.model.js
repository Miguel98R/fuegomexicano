const mongoose = require('mongoose');

const {Schema} = mongoose;

const imagesModel = require('./images.model')

const sliderSchema = new Schema({
    images: {
        type: Schema.Types.ObjectId,
        ref: imagesModel,
        required: false
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    button_conf: {
        _id: false,
        button_text: {
            type: String,
            required: false
        },
        button_href: {
            type: String,
            required: false
        },
    }
}, {
    timestamps: true,
});

const Slider = mongoose.model('sliders', sliderSchema);

module.exports = Slider;
