require('../configs/db.config');
const {connection} = require('mongoose');
const DishModel = require('../models/dish.model');
const {CustomerModel, BusinessModel} = require('../models/user.model');


// DishModel.insertMany(
//     [{name: 'SeaFood Paella', price: 40},
//     {name: 'Okonomiyaki', price: 20},
//     {name: 'Katsudon', price: 15},
//     {name: 'Kitsuneudon', price: 20},
//     {name: 'Dorayaki', price: 10}])
//     .then((dataSeeded)=>{
//         console.log('DataSeeded:',dataSeeded);
//         connection.close()
//     })
//     .catch((err)=> console.log('Failed to update dishes. Reason: ', err))

// BusinessModel.insertMany([
//     {
//         userName: 'Izakaya',
//         email: 'izakaya@food.com',
//         passwordHash: '$2y$10$SwQ0.CzZgDEb42l8J8gBjeo/0sn4fV6PGDcB6OavOnOfhyvAp.IT.', //Izakaya1
//         location: {city: 'Madrid', address:'something street'},
//         cuisine: 'Japanese',
//     },
//     {
//         userName: 'Luigi',
//         email: 'luigi@food.com',
//         passwordHash: '$2y$10$rc.BelBXHuxNN3//dkAF4.pSi8KoCCLt8CZgNM7WCn7bSE9EEMC02', //Luigi1
//         location: {city: 'Gran Canaria', address:'someone avenue'},
//         cuisine: 'Italian'
//     },
//     {
//         userName: 'CactusLife',
//         email: 'cactus@food.com',
//         passwordHash: '$2y$10$YnD2N5e6yy6o8T/h/1UxIeXJur/fBDp1DSlv3G4fYQ2JtzlY1BV7G', //CactusLife1
//         location: {city: 'Bilbao', address:'somewhere promenade'},
//         cuisine: 'Tex-Mex'
//     }
// ])
//         .then((dataSeeded)=>{
//             console.log('Connection closed');
//             connection.close()
//                 .catch(()=> console.log ('Failed to close connection'))
//         })
//         .catch((err)=> console.log ('Failed to insert seeds. Reason: ', err))

        BusinessModel.find({userName: 'Izakaya'}).populate('menu')
            .then((result)=>{console.log (result[0].menu)})