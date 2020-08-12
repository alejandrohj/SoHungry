const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const { BusinessModel} = require('../models/user.model');
const OrderModel = require('../models/order.model');

//Set private routes for the customers
router.use((req,res,next) => {
    if(req.session.usertype == 'customer'){
        next();
    }
    else{
        res.redirect('/')
    }
})

//Main page for customers: search page
router.get('/',(req,res)=>{
    let usertype = req.session.usertype;
    BusinessModel.find()
        .then((restaurants)=>{
            let matches;
            req.session.matches ?  matches = req.session.matches : matches = restaurants;
            res.render('user/search.hbs',{usertype, restaurants, matches});
        })
    
});

//User searchs for a restaurant
router.post('/search',(req,res)=>{
    const {city, cuisine} = req.body;
    if(city !== 'Choose...' && cuisine === 'Choose...'){
        BusinessModel.find({"location.city": city})
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

//Log out logic for the customer nav bar
router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
});

//User clicks on a restaurant
router.get ('/order/:id', (req, res)=>{
    BusinessModel.findById(req.params.id).populate('menu').populate('menu.dishId')
        .then((result)=>{
            let catOrder=['drink','starter','main','dessert']
            let categories =[]
            result.menu.forEach(element=> {if (!categories.includes(element.category)) categories[catOrder.indexOf(element.category)]=element.category}) //extract the categories of the dishes as an array of unique elements
            res.render ('user/order.hbs', {dish: result.menu, id: result._id, categories})
        })
        .catch(err => console.log('Could not find restaurant. Error is: '+ err))

})

//User places an order
router.post ('/order/:id', (req, res)=>{
    let total = req.body.total
    let table = req.body.table
    let idArr = Object.keys(req.body).slice(0, -2);
    let quantArr = Object.values(req.body).slice(0, -2);
    const order = idArr.map((element, index)=>({'dishId': element, 'quantity': quantArr[index]}));
    OrderModel.create({user: req.session.loggedInUser._id, business: req.params.id, order, status: 'pending', total, table})
        .then(()=>res.redirect ('/user/myorders'))
        .catch(err => console.log('Could not create order. Error is: '+ err))
})

//Order history for the customer side
router.get('/myorders', (req, res)=>{
    OrderModel.find({user: req.session.loggedInUser._id}).populate('business').populate('order.dishId')
        .then((orders)=>{
            res.render('user/myorders.hbs', {orders})
        })
        .catch(err => console.log('Could get orders. Error is: '+ err))


})

module.exports = router;