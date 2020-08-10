const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');
const OrderModel = require('../models/order.model');

router.use((req,res,next) => {
    if(req.session.usertype == 'customer'){
        next();
    }
    else{
        res.redirect('/')
    }
})
router.get('/',(req,res)=>{
    let usertype = req.session.usertype;
    BusinessModel.find()
        .then((restaurants)=>{
            let matches;
            req.session.matches ?  matches = req.session.matches : matches = restaurants;
            res.render('user/search.hbs',{usertype, restaurants, matches});
        })
    
});

router.post('/search',(req,res)=>{
    const {city, cuisine} = req.body;
    if(city !== 'Choose...' && cuisine === 'Choose...'){
        BusinessModel.find({"location.city": city})
            .populate('logo')
            .then((matches)=>{
                req.session.matches = matches;
                res.redirect('/user');
            });
    }
    else if(city === 'Choose...' && cuisine !== 'Choose...'){
        BusinessModel.find({cuisine:cuisine})
            .then((matches)=>{
                req.session.matches = matches;
                res.redirect('/user');
            });
    }
    else {
        BusinessModel.find({"location.city": city, cuisine:cuisine})
            .then((matches)=>{
                req.session.matches = matches;
                res.redirect('/user');
            });
    }
});

router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
});

router.get ('/order/:id', (req, res)=>{
    BusinessModel.findById(req.params.id).populate('menu')
        .then((result)=>{
            res.render ('user/order.hbs', {dish: result.menu, id: result._id})
        })
        .catch(err => console.log('Could not find restaurant. Error is: '+ err))

})

router.post ('/order/:id', (req, res)=>{
    let total = req.body.total
    let idArr = Object.keys(req.body).slice(0, -1);
    let quantArr = Object.values(req.body).slice(0, -1);
    const order = idArr.map((element, index)=>({'dishId': element, 'quantity': quantArr[index]}));
    OrderModel.create({user: req.session.loggedInUser._id, business: req.params.id, order, status: 'pending', total})
        .then(()=>res.redirect ('/user/myorders'))
        .catch(err => console.log('Could not create order. Error is: '+ err))
})

router.get('/myorders', (req, res)=>{
    OrderModel.find({user: req.session.loggedInUser._id}).populate('business').populate('order.dishId')
        .then((orders)=>{
            res.render('user/myorders.hbs', {orders})
        })
        .catch(err => console.log('Could get orders. Error is: '+ err))


})

module.exports = router;