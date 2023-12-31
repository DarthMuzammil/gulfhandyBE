const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceRequestSchema = new Schema({
    userId: Schema.Types.ObjectId,
    address: String,
    serviceId: Schema.Types.ObjectId,
    phoneNumber: String,
    status: Number,
    handyMan: String,
});


module.exports = mongoose.model('ServiceRequestSchema', serviceRequestSchema);
