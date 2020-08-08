const {Schema, model} = require('mongoose');

let orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'customer'
    },
    business: {
        type: Schema.Types.ObjectId,
        ref: 'restaurant'
    },
    order: [
        {
            dishId: {
                type: Schema.Types.ObjectId,
                ref: 'dish'
            },
            quantity: {
                type: Number
            }
        }
    ],
    status: {
        type: String,
        required: true,
        enum: ['done', 'pending']
    },

});

module.exports = model('order', orderSchema);