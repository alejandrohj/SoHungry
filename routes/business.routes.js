const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');

router.get('/business',(req,res)=>{
    res.render('business/myrestaurant.hbs');
});


module.exports = router;