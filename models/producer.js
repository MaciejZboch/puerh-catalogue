const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProducerSchema = new Schema({
    name: String,
    url: String,
    location: String,
})

module.exports = mongoose.model('Producer', ProducerSchema)