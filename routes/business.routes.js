const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const {BusinessModel} = require('../models/user.model');
const DishModel = require('../models/dish.model');
const OrderModel = require('../models/order.model');


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
        res.render('business/myrestaurant.hbs', {restaurant: restaurant[0]});
    })
    .catch((err) => console.log ('Could not find restaurant. Error: ', err))
});

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

router.get('/logout',(req,res)=>{
    req.session.destroy(res.redirect('/'))
    
});

router.post('/', (req, res)=>{
    let {userName, cuisine, capacity, description, city, address, email} = req.body;
    let RestaurantID = req.session.loggedInUser._id;
    BusinessModel.findByIdAndUpdate(RestaurantID, {$set: {userName, cuisine, capacity, description, "location.city": city, "location.address": address, email}})
        .then(()=>res.redirect('/business'))
        .catch((err)=> console.log ('Could not upload the profile. Error is: ', err))
});

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

router.post('/editDish/:id',(req,res)=>{
    const {name, price, description, category} = req.body;
    const dishId = req.params.id;
    DishModel.findByIdAndUpdate(dishId, {name: name, price: price, description: description, category: category})
        .then(()=>{
            res.redirect('/business/menu')
        });
});

router.get('/orders', (req, res)=>{
    OrderModel.find({business: req.session.loggedInUser._id}).populate('user').populate('order.dishId')
        .then((orders)=>res.render('business/orders', {orders}))
        .catch((err)=> console.log('Could not get orders. Error: ', err))
})

router.post('/orders/:id', (req, res)=>{
    const orderId = req.params.id
    OrderModel.findByIdAndUpdate(orderId, {status: 'done'})
        .then(()=> res.redirect('/business/orders'))
        .catch((err)=> console.log('Could not update status. Error:', err))
})
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

module.exports = router;