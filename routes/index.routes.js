const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const {CustomerModel, BusinessModel} = require('../models/user.model');

// function validateForm(name, password, usertype, email){
//   if(!name || !email || !password){
//     res.status(500).render('signup.hbs', {errorMessage: 'Please enter all details'})
//     return;
// }

// const emailReg = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
// if (!emailReg.test(email)){
//   res.status(500).render('signup.hbs', {errorMessage: 'Please enter valid email'})
//   return;
// }

// const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)
// if (!passReg.test(password)){
//   res.status(500).render('signup.hbs', {errorMessage: 'Password must be 6 characters and must have a nu ber and a string'})
//   return;
// }
// }

router.get('/', (req, res) => {
    res.render('login.hbs')
});

router.post('/', (req, res) =>{
    console.log (req.body);
    res.redirect('/');
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


router.post('/signin', (req, res) => {
  const { name, password, usertype} = req.body

  if( !name || !password){
      res.status(500).render('login.hbs', {errorMessage: 'Please enter all details'})
      return;
  }

  const emailReg = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
  if (!emailReg.test(email)){
    res.status(500).render('login.hbs', {errorMessage: 'Please enter valid email'})
    return;
  }

  const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)
  if (!passReg.test(password)){
    res.status(500).render('login.hbs', {errorMessage: 'Password must be 6 characters and must have a nu ber and a string'})
    return;
  }

    res.redirect('/');
});

module.exports = router;