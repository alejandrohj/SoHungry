const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');

router.get('/user',(req,res)=>{
    res.render('user/search.hbs');
});


module.exports = router;