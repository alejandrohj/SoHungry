const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');

//Home route
router.get('/', (req, res) => {
    res.render('login.hbs',{errorMessage: 'Please register or log in before proceeding'})
});
//Register route
router.get('/signup', (req, res) => {
    res.render('signup.hbs')
});
//User sends register form
router.post('/signup', (req, res) =>{
    const {userName, email, password, usertype} = req.body
    console.log(req.body)

    if(!userName || !email || !password){
        res.status(500).render('signup.hbs', {errorMessage: 'Please enter all details'})
        return;
    }

    const emailReg = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    if (!emailReg.test(email)){
      res.status(500).render('signup.hbs', {errorMessage: 'Please enter valid email'})
      return;
    }

    const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,15}$/) //Password of 6 to 15 characters
    if (!passReg.test(password)){
      res.status(500).render('signup.hbs', {errorMessage: 'Password must be 6 characters and must have a number and a string'})
      return;
    }
  if (usertype== 'customer'){
      bcryptjs.genSalt(10)
        .then((salt) => {
            bcryptjs.hash(password , salt)
              .then((hashPass) => {
                  CustomerModel.create({userName, email, passwordHash: hashPass })
                    .then(() => {
                        res.redirect('/')
                    })
              })
        })
    }

    if (usertype== 'business'){
      bcryptjs.genSalt(10)
        .then((salt) => {
            bcryptjs.hash(password , salt)
              .then((hashPass) => {
                  BusinessModel.create({userName, email, passwordHash: hashPass })
                    .then(() => {
                        res.redirect('/')
                    })
              })
        })
    }
})
//User tries to log in
router.post('/login', (req, res) => {
  const { userName, password, usertype} = req.body

  if( !userName || !password){
      res.status(500).render('login.hbs', {errorMessage: 'Please enter all details'})
      return;
  }

  const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)

  if (!passReg.test(password)){
    res.status(500).render('login.hbs', {errorMessage: 'Password must be 6 characters and must have a number and a string'})
    return;
  }

  if(usertype==='customer'){

   CustomerModel.findOne({userName: userName})
    .then((user)=>{
      const match = bcryptjs.compare(password, user.passwordHash)
      if (match){
        req.session.loggedInUser = user;
        req.session.usertype = usertype;
        req.session.desiredUrl ? res.redirect(`${req.session.desiredUrl}`) : res.redirect('/user')
      }
      else{
        res.status(500).render('login.hbs', {errorMessage: 'Password does not match.'});
      }
    })
    .catch((err)=>{
      console.log('Error is: ', err)
      res.status(500).render('login.hbs', {errorMessage: 'There is no user with that name in the customer category.'})
    })
  }
    
  if(usertype==='business'){

   BusinessModel.findOne({userName: userName})
    .then((user)=>{
      const match = bcryptjs.compare(password, user.passwordHash)
      if (match){
        req.session.loggedInUser = user;
        req.session.usertype = usertype;
        req.session.desiredUrl ? res.redirect(`${req.session.desiredUrl}`) : res.redirect('/business')
      }
      else{
        res.status(500).render('login.hbs', {errorMessage: 'Password does not match.'});
      }
    })
    .catch((err)=>{
      console.log('Error is: ', err)
      res.status(500).render('login.hbs', {errorMessage: 'There is no user with that name in the customer category.'})
    })
  }
}
)
module.exports = router;