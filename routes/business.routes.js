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
      res.render('business/myrestaurant.hbs', restaurant);
    })
    .catch((err) => console.log ('Could not find restaurant. Error: ', err))
});

router.get('/menu',(req,res)=>{
    res.render('business/mymenu.hbs');
});


module.exports = router;