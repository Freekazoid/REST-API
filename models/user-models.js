const {Schema, model} = require('mongoose');

const UserScheme = new Schema({
    // unique: true, required: true
    email: { type: String, required: false },
    phone: { type: String, required: false },
    password: { type: String, required: true }
})

module.exports = model('User', UserScheme);