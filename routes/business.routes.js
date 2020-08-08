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
    console.log(req.session.loggedInUser._id)
    BusinessModel.findById({_id:req.session.loggedInUser._id})
        .populate('menu')
        .then((restaurantInfo)=>{
            res.render('business/mymenu.hbs',{restaurantInfo})
        });
});

router.get('/logout',(req,res)=>{
    req.session.destroy(res.redirect('/'))
    
});

router.post('/', (req, res)=>{
    let {userName, cuisine, capacity, description, city, address, logo, email} = req.body
    let RestaurantID = req.session.loggedInUser._id
    console.log (cuisine)
    BusinessModel.findByIdAndUpdate(RestaurantID, {$set: {userName, cuisine, capacity, description, location, logo, email}})
        .then(()=>redirect('/business'))
        .catch((err)=> console.log ('Could not upload the profile. Error is: ', err))
});

router.post('/addDish',(req,res)=>{
    const {name, price} = req.body;
    const reg = new RegExp('^[0-9]+(\.\[0-9]{1,2})?$');
    console.log('price',price)
    if(!reg.test(price)) {
        res.status(500).render('business/menu.hbs', {errorMessage: 'Please enter a valid price: ..000.00'})
        return;
    }
    else{
        DishModel.create({name: name, price: price}) //We create the new dish
        .then((dishToReference)=>{
            BusinessModel.findById(req.session.loggedInUser._id) //Show the logged restaurant
                .then((currentBusiness)=>{
                    let currentDishes = currentBusiness.menu; //And extract the current dishes
                    currentDishes.push(dishToReference._id); //Then we add the new dish to the current dishes arr
                    BusinessModel.findOneAndUpdate({_id:currentBusiness._id},{$set:{menu: currentDishes}})
                        .then(()=>{
                            res.redirect('/business/menu')
                        })
                }); 
            });
    }
});

module.exports = router;