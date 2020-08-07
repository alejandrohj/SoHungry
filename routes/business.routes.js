const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');

router.get('/business',(req,res)=>{
    BusinessModel.find({_id: req.session.loggedInUser._id})
    .then((restaurant)=>{
      res.render('business/myrestaurant.hbs', restaurant);
    })
    .catch((err) => console.log ('Could not find restaurant. Error: ', err))
});


module.exports = router;