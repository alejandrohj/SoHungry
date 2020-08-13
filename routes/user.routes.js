const express = require('express');
const router = express.Router();
const { BusinessModel } = require('../models/user.model');
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
        .then((restaurant)=>{
            let catOrder=['starter','main','dessert','drink']
            let categories =[]
            restaurant.menu.forEach(element=> {if (!categories.includes(element.category)) categories[catOrder.indexOf(element.category)]=element.category}) //extract the categories of the dishes as an array of unique elements
            res.render ('user/order.hbs', {dish: restaurant.menu, id: restaurant._id, categories, restaurant})
        })
        .catch(err => console.log('Could not find restaurant. Error is: '+ err))
})

//User places an order
router.post ('/order/:id', (req, res)=>{
    let total = req.body.total
    let table = req.body.table
    let idArr = Object.keys(req.body).slice(1, -1);
    let quantArr = Object.values(req.body).slice(1, -1);
    const order = idArr.map((element, index)=>({'dishId': element, 'quantity': quantArr[index]}));
    req.session.totalAmount = total;
    OrderModel.create({user: req.session.loggedInUser._id, business: req.params.id, order, status: 'pending', total, table})
        .then(()=>res.redirect ('/user/payment'))
        .catch(err => console.log('Could not create order. Error is: '+ err))
})

//Order history for the customer side
router.get('/myorders', (req, res)=>{
    OrderModel.find({user: req.session.loggedInUser._id}).sort({createdAt: -1}).populate('business').populate('order.dishId')
        .then((orders)=>{
            let ages=[];
            orders.forEach(order=> {
                let orderAge = Math.floor((Date.now() - order.createdAt)/1000/60)
                if (orderAge<1) ages.push('Just now')
                if (orderAge>=1 && orderAge<60) ages.push(`${Math.floor(orderAge)} min ago`)
                if (orderAge>60 && orderAge<60*2) ages.push (`${Math.floor(orderAge/60)} hour ago`)
                if (orderAge>60*2 && orderAge<60*24) ages.push (`${Math.floor(orderAge/60)} hours ago`)
                if (orderAge>60*24) ages.push('A long time ago')
            })
            res.render('user/myorders.hbs', {orders, ages})
        })
        .catch(err => console.log('Could not get orders. Error is: '+ err))
});

//pay path:
router.get('/payment', (req, res)=>{
    OrderModel.find({user: req.session.loggedInUser._id}).populate('business').populate('order.dishId')
        .then((orders)=>{
            res.render('checkout.hbs',{layout: false})
            
        })
        .catch(err => console.log('Could get orders. Error is: '+ err))
});

module.exports = router;