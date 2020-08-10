const {Schema, model} = require('mongoose');

let photoSchema = new Schema({
  title: { type: String, length: 255 },
  image: { type: JSON }
});

module.exports = model('photo', photoSchema);