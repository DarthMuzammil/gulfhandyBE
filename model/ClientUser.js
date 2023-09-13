const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientUserSchema = new Schema({
    username: String,
    password: String,
    phoneNumber: String,
    email: String
});


module.exports = mongoose.model('ClientUserSchema', clientUserSchema);
