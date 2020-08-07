const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');


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

router.post('/', (req, res)=>{
    let {userName, cuisine, capacity, description, city, address, logo, email} = req.body
    let RestaurantID = req.session.loggedInUser._id
    console.log (cuisine)
    BusinessModel.findByIdAndUpdate(RestaurantID, {$set: {userName, cuisine, capacity, description, "location.city": city, "location.address": address, logo, email}})
        .then(()=>redirect('/business'))
        .catch((err)=> console.log ('Could not upload the profile. Error is: ', err))
})

module.exports = router;