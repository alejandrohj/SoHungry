const {Schema, model} = require('mongoose');

let dishSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: Number,
    photo:{
        type: Schema.Types.ObjectId,
        ref: 'photo'
    }
});

module.exports = model('dish', dishSchema);