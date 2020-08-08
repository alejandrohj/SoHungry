const { Schema, model } = require('mongoose');
// require('../configs/user.models.js');


let customerSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    }
});

let businessSchema = new Schema({
    userName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    passwordHash:{
        type: String,
        required: true
    },
    capacity: Number,
    logo: String,
    location:{
        city: String,
        address: String
    },
    cuisine:{
        type: String,
        enum: ['Japanese', 'Italian', 'Tex-Mex']
    },
    menu:[
        {
            type: Schema.Types.ObjectId,
            ref: 'dish'
        }],
    description: {
        type: String,
        maxlength: 100
    }

})

module.exports = {CustomerModel: model('customer', customerSchema), BusinessModel: model('restaurant', businessSchema)};