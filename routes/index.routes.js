const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const {CustomerModel} = require('../models/user.model');
const {BusinessModel} = require('../models/user.model');

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
    console.log (req.body);
    res.redirect('/');
});

module.exports = router;