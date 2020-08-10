const {Schema, model} = require('mongoose');

let dishSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: Number,
    photo:{
        type: String
    },
    description : String
});

module.exports = model('dish', dishSchema);