const { Schema, model } = require('mongoose');

const FileScheme = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    originalname: { type: String, required: true },
    extension: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    date: { type: Date, default: Date.now }
})

module.exports = model('File', FileScheme);