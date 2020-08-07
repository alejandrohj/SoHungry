const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');
const DishModel = require('../models/dish.model');


router.use((req,res,next) => {
    if(req.session.usertype == 'business'){
        next();
    }
    else{
        res.redirect('/')
    }
})

router.get('/',(req,res)=>{
    BusinessModel.find({_id: req.session.loggedInUser._id})
    .then((restaurant)=>{
      res.render('business/myrestaurant.hbs', {restaurant: restaurant[0]});
    })
    .catch((err) => console.log ('Could not find restaurant. Error: ', err))
});

router.get('/menu',(req,res)=>{
    let dishes;
    if(req.session.loggedInUser) {dishes = req.session.loggedInUser.menu;}
    console.log(dishes)
    res.render('business/mymenu.hbs',{dishes});
});

router.get('/logout',(req,res)=>{
    req.session.destroy(res.redirect('/'))
    
});

router.post('/', (req, res)=>{
    let {userName, cuisine, capacity, description, city, address, logo, email} = req.body
    let RestaurantID = req.session.loggedInUser._id
    console.log (cuisine)
    BusinessModel.findByIdAndUpdate(RestaurantID, {$set: {userName, cuisine, capacity, description, "location.city": city, "location.address": address, logo, email}})
        .then(()=>res.redirect('/business'))
        .catch((err)=> console.log ('Could not upload the profile. Error is: ', err))
});

router.post('/addDish',(req,res)=>{
    const {name, price} = req.body;
    DishModel.create({name: name, price: price})
        .then(()=>{
            DishModel.find({name: name, price: price})
                .then((dishToReference)=>{
                    let currentDishes = req.session.loggedInUser.menu;
                    currentDishes.push(dishToReference[0]._id);
                    BusinessModel.findByIdAndUpdate(req.session.loggedInUser._id,{menu: currentDishes})
                        .then((dishAdded)=>{
                            console.log('Dish added: ',dishAdded)
                                res.redirect('/business/menu');
                        })
                });
        });
});



module.exports = router;