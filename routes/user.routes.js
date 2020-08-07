const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');

router.use((req,res,next) => {
    if(req.session.usertype == 'customer'){
        next();
    }
    else{
        res.redirect('/')
    }
})
router.get('/user',(req,res)=>{
    let usertype = req.session.usertype;
    BusinessModel.find()
        .then((restaurants)=>{
            console.log(restaurants)
            res.render('user/search.hbs',{usertype, restaurants});
        })
    
});

router.post('/search',(req,res)=>{
    const {city, cuisine} = req.body;
    BusinessModel.find({"location.city": city, cuisine:cuisine})
        .then((match)=>{
            console.log(match);
        });
});

module.exports = router;