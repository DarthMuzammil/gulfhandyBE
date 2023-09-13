const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminUserSchema = new Schema({
    username: String,
    password: String,
});


module.exports = mongoose.model('AdminUserSchema', adminUserSchema);
