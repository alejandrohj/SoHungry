const {Schema, model} = require('mongoose');

let dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: Number
});

module.exports = model('dish', dishSchema);