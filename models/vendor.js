const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    name: String,
    url: String,
    location: String,
})

module.exports = mongoose.model('Vendor', VendorSchema)