const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
    title: String,
    description: String,
    pricePerUnit: Number,
    unitType: String
});


module.exports = mongoose.model('Services', serviceSchema);
