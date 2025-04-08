const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    date: {
        type: Date,
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