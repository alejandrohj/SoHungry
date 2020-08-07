require('../configs/db.config');
const mongoose = require('mongoose');
const DishModel = require('../models/dish.model');


DishModel.create({name: 'SeaFood Paella', price: 40})
    .then((dataSeeded)=>{
        console.log('DataSeeded:',dataSeeded);
        mongoose.connection.close();
    })