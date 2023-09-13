const mongoose = require('mongoose');
const { Schema } = mongoose;

const handyManUser = new Schema({
    username: String,
    address: String,
    service: String
});


module.exports = mongoose.model('HandyManUser', handyManUser);
