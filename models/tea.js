const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const Vendor = require('./vendor')
const Producer = require('./producer')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_scale,w_399')
});

const TeaSchema = new Schema({
    name: String,
    description: String,
    images: [ImageSchema],
    type: {type: String,
        enum: ['Raw / Sheng', 'Ripe / Shu', 'blend']},
    year: Number,
    region: String,
    village: String,
    ageing_location: String,
    ageing_conditions: {
        type: String,
        enum: ['Dry', 'Natural', 'Wet', 'Hong-Kong Traditional']},
    shape: {
        type: String,
        enum: ['Loose', 'Cake', 'Tuo', 'Brick', 'Mushroom', 'Dragon ball', 'Tube', 'Melon', 'Other']},
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    producer: {
        type: Schema.Types.ObjectId,
        ref: 'Producer'
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Tea', TeaSchema);