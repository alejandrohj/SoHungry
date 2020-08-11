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
    description : String,
    category:{
        type: String,
        enum: ['drink','starter','main','dessert']
    }
});

module.exports = model('dish', dishSchema);