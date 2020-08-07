const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {CustomerModel, BusinessModel} = require('../models/user.model');


router.get('/', (req, res) => {
    res.render('login.hbs')
});

router.get('/signup', (req, res) => {
    res.render('signup.hbs')
});

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

    const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)
    if (!passReg.test(password)){
      res.status(500).render('signup.hbs', {errorMessage: 'Password must be 6 characters and must have a number and a string'})
      return;
    }
  if (usertype== 'customer'){
      bcryptjs.genSalt(10)
        .then((salt) => {
            bcryptjs.hash(password , salt)
              .then((hashPass) => {
                  console.log(hashPass)
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
                  console.log(hashPass)
                  BusinessModel.create({userName, email, passwordHash: hashPass })
                    .then(() => {
                        res.redirect('/')
                    })
              })
        })
    }
})

router.post('/login', (req, res) => {
  const { userName, password, usertype} = req.body

  if( !userName || !password){
      res.status(500).render('login.hbs', {errorMessage: 'Please enter all details'})
      return;
  }

  const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)
  if (!passReg.test(password)){
    res.status(500).render('login.hbs', {errorMessage: 'Password must be 6 characters and must have a nu ber and a string'})
    return;
  }

  if(usertype==='customer'){

   CustomerModel.findOne({userName: userName})
    .then((user)=>{
      const match = bcryptjs.compare(password, user.passwordHash)
      if (match){
        req.session.loggedInUser = user;
        req.session.usertype = usertype;
        res.redirect('/user')
      }
      else{
        res.status(500).render('login.hbs', {errorMessage: 'Password does not match.'});
      }
    })
    .catch((err)=>console.log('Error is: ', err))
  }
    
  if(usertype==='business'){

   BusinessModel.findOne({userName: userName})
    .then((user)=>{
      const match = bcryptjs.compare(password, user.passwordHash)
      if (match){
        req.session.loggedInUser = user;
        req.session.usertype = {usertype};
        console.log (req.session)
        res.redirect('/business')
      }
      else{
        res.status(500).render('login.hbs', {errorMessage: 'Password does not match.'});
      }
      })
    .catch((err)=>console.log('Error is: ', err))
      res.redirect('/');
    }
}
)
module.exports = router;