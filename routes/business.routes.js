const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const {BusinessModel} = require('../models/user.model');
const DishModel = require('../models/dish.model');
const OrderModel = require('../models/order.model');
const QRCode = require('qrcode');
const session = require('express-session');


//Set private routes for the business side
router.use((req,res,next) => {
    if(req.session.usertype == 'business'){
        next();
    }
    else{
        res.redirect('/')
    }
})
//Main page for businesses: profile page
router.get('/',(req,res)=>{
    BusinessModel.find({_id: req.session.loggedInUser._id})
    .then((restaurant)=>{
        res.render('business/myrestaurant.hbs', {restaurant: restaurant[0]})
    })
    .catch((err) => console.log ('Could not find restaurant. Error: ', err))
});

//Page for filling the restaurant menu
router.get('/menu',(req,res)=>{
    let temporalImg;
    if(req.session.dishPhoto){
        temporalImg = req.session.dishPhoto;
    }
    console.log('temporal img:',req.session.dishPhoto)
    BusinessModel.findById({_id:req.session.loggedInUser._id})
        .populate({
            path:'menu'
        })
        .then((restaurantInfo)=>{
            res.render('business/mymenu.hbs',{restaurantInfo, temporalImg})
        });
});

//Log out logic for the business side nav bar
router.get('/logout',(req,res)=>{
    req.session.destroy(res.redirect('/'))
});

//Restaurant sends form to edit its profile information
router.post('/', (req, res)=>{
    let {userName, cuisine, capacity, description, city, address, email} = req.body;
    let RestaurantID = req.session.loggedInUser._id;
    BusinessModel.findByIdAndUpdate(RestaurantID, {$set: {userName, cuisine, capacity, description, "location.city": city, "location.address": address, email}})
        .then(()=>res.redirect('/business'))
        .catch((err)=> console.log ('Could not upload the profile. Error is: ', err))
});

//Restaurant adds a dish to its menu
router.post('/addDish',(req,res)=>{
    const {name, price, description, category} = req.body;
    if(!name || !price || !description || !category){
        res.status(500).render('business/mymenu.hbs', {errorMessage: 'Please you must fill all the fields'})
        return;
    }
    const reg = new RegExp('^[0-9]+(\.\[0-9]{1,2})?$');
    if(!reg.test(price)) {
        res.status(500).render('business/mymenu.hbs', {errorMessage: 'Please enter a valid price: ..000.00'})
        return;
    }
    if(!req.session.dishPhoto){
        res.status(500).render('business/mymenu.hbs', {errorMessage: 'Please enter a image'})
        return;
    }
    else{
        DishModel.create({name: name, price: price, description: description, category: category, photo: req.session.dishPhoto}) //We create the new dish
        .then((dishToReference)=>{
            BusinessModel.findById(req.session.loggedInUser._id) //Show the logged restaurant
                .then((currentBusiness)=>{
                    let currentDishes = currentBusiness.menu; //And extract the current dishes
                    currentDishes.push(dishToReference._id); //Then we add the new dish to the current dishes arr
                    BusinessModel.findOneAndUpdate({_id:currentBusiness._id},{$set:{menu: currentDishes}})
                        .then(()=>{
                            res.redirect('/business/menu')
                        })
                }); 
            });
    }
});

//Restaurant edits a dish from its menu
router.post('/editDish/:id',(req,res)=>{
    const {name, price, description, category} = req.body;
    const dishId = req.params.id;
    DishModel.findByIdAndUpdate(dishId, {name: name, price: price, description: description, category: category})
        .then(()=>{
            res.redirect('/business/menu')
        });
});

//Orders history for the business side
router.get('/orders', (req, res)=>{
    OrderModel.find({business: req.session.loggedInUser._id}).sort({createdAt: -1}).populate('user').populate('order.dishId')
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
            res.render('business/orders', {orders, ages})
        })
        .catch((err)=> console.log('Could not get orders. Error: ', err))
})

//Restaurant marks an order as done
router.post('/orders/:id', (req, res)=>{
    const orderId = req.params.id
    OrderModel.findByIdAndUpdate(orderId, {status: 'done'})
        .then(()=> res.redirect('/business/orders'))
        .catch((err)=> console.log('Could not update status. Error:', err))
})

//Restaurant deletes a dish from its menu
router.get('/delete/:id',(req,res)=>{
    DishModel.findByIdAndDelete(req.params.id)
        .then(()=>{
            BusinessModel.findById(req.session.loggedInUser._id) //Show the logged restaurant
                .then((currentBusiness)=>{
                    let currentDishes = currentBusiness.menu; //And extract the current dishes
                    let indexToDelete  = currentDishes.indexOf(req.params.id)
                    currentDishes.splice(indexToDelete,1); //Then we add the new dish to the current dishes arr
                    BusinessModel.findOneAndUpdate({_id:currentBusiness._id},{$set:{menu: currentDishes}})
                        .then(()=>{
                            res.redirect('/business/menu');
                        })
                }); 
        });          
});
// Restaurant gets its QRcode
router.get('/qrcode',(req,res)=>{
        QRCode.toDataURL(`https://so-hungry.herokuapp.com/user/order/${req.session.loggedInUser._id}`)
            .then(url => {
                res.render('business/qrcodes.hbs', {id: req.session.loggedInUser._id, url});
            })
            .catch(err => {
              console.error(err)
            })      
    })

module.exports = router;