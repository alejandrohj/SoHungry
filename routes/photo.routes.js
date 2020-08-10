const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
const Photo = require('../models/photo.model');
const {CustomerModel, BusinessModel} = require('../models/user.model');

const multipartMiddleware = multipart();

router.post('/addLogo',multipartMiddleware,(req,res)=>{
  // In through-the-server mode, the image is first uploaded to the server
  // and from there to Cloudinary servers.
  // The upload metadata (e.g. image size) is then added to the photo  model (photo.image)
  // and then saved to the database.
    console.log('body:',req.body)
  // file was not uploaded redirecting to upload
  if (!req.files.image) {
    res.redirect('/business');
    return;
  }

  var photo = new Photo(req.body);
  // Get temp file path
  var imageFile = req.files.image.path;
  // Upload file to Cloudinary
  cloudinary.uploader.upload(imageFile, { tags: 'express_sample' })
    .then(function (image) {
      console.log('** file uploaded to Cloudinary service');
      console.dir(image);
      photo.image = image;
      // Save photo with image metadata
      return photo.save();
    })
    .then(function () {
        BusinessModel.findByIdAndUpdate(req.session.loggedInUser._id, {logo: photo._id})
        .then((response)=>{
            res.redirect('/business')
            //res.render('phototest.hbs', { photo: photo, upload: photo.image })
        })
    })
    .finally(function () {

      //res.render('phototest.hbs', { photo: photo, upload: photo.image });
    });
});

router.post('/addDish',multipartMiddleware,(req,res)=>{
    // In through-the-server mode, the image is first uploaded to the server
    // and from there to Cloudinary servers.
    // The upload metadata (e.g. image size) is then added to the photo  model (photo.image)
    // and then saved to the database.
    // file was not uploaded redirecting to upload
    if (!req.files.image) {
      res.redirect('/business');
      return;
    }
  
    var photo = new Photo(req.body);
    // Get temp file path
    var imageFile = req.files.image.path;
    // Upload file to Cloudinary
    cloudinary.uploader.upload(imageFile, { tags: 'express_sample' })
      .then(function (image) {
        console.log('** file uploaded to Cloudinary service');
        console.dir(image);
        photo.image = image;
        // Save photo with image metadata
        return photo.save();
      })
      .then(function () {
         req.session.dishPhoto = photo;
         res.redirect('/business/menu');
      })
      .finally(function () {
  
        //res.render('phototest.hbs', { photo: photo, upload: photo.image });
      });
  });
module.exports = router;