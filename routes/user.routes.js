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
    res.render('user/search.hbs',{usertype});
});


module.exports = router;