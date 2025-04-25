const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    date: {
        type: Number,
        required: true
    },
    food: {
        type: String,
        required: true
    },
    week: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Food', foodSchema);