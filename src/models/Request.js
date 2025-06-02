const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    isBlank: {
        type: Boolean,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    isAnnonymous: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Request', requestSchema); 