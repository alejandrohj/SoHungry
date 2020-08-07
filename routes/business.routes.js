const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');


router.use((req,res,next) => {
    if(req.session.usertype == 'business'){
        console.log ('Private business works')
        next();
    }
    else{
        res.redirect('/')
    }
})

router.get('/business',(req,res)=>{
    let restaurant = req.session.loggedInUser;
    // BusinessModel.find({_id: req.session.loggedInUser._id})
    // .then((restaurant)=>{
      res.render('business/myrestaurant.hbs');
    // })
    // .catch((err) => console.log ('Could not find restaurant. Error: ', err))
});


module.exports = router;