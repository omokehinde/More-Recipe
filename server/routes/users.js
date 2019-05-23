const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Bring in user model
let models = require('../models/index.js');

// Register user
router.post('/register', checkIfEmailExist, checkIfUsernameExist, (req, res) =>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not vald').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Paswword does not match').equals(req.body.password);

    let errors = req.validationErrors();
    if (errors){
        res.status(412).send({errors:errors});
    } else{
        let newUser = {
            firstName: firstName,
            lastName:  lastName,
            username:  username,
            email:     email,
            password:  password
        };
        bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(newUser.password, salt, (err, hash) =>{
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                models.user.create(newUser).then(()=>{
                    res.status(201).send({message: `Your account has been created `+firstName+`!`});
                })
                .catch((err)=>{
                    res.status(400).send(err);
                });
            });
        });
    }
});

// login process
router.post('/login', (req, res, next) => {
    // models.user.findOne({
    //     where: {
    //         'username':req.body.username
    //     }
    // }).then( ( user) => {
    //     if (user) {
    //       res.status(200).send({message: "user found"});
    //     } else res.send({message: "user not found!"});
    //   }); next();
      
      models.user.findOne({
        where: {
            'email':req.body.email
        }
    }).then( ( user) => {
        if (user) {

      // Match Password
      bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
        if (err) {
            throw err;
        }
        if (isMatch) {
            const token = jwt.sign({id:user.id}, 'mysecret_key')
            return res.send( {message:"You are now logged in ", token:token});
        } else {
            return res.send({message:'Wrong password'});
        }
      });
        } else res.send({message: "user not found!"});
      });
});

//logout
router.get('/logout', (req, res) => {
    req.logout();
    res.status(204).send({message: "You are now logged out."});
});

// middleware to check if email exist
function checkIfEmailExist(req, res, next) {
    models.user.findOne({
        where: {
            'email':req.body.email
        }
    }).then(( user) => {
      if (user) {
        res.status(400).send({error: "The email is in use."});
      }
    });
    next();
  }
// middleware to check if email exist
function checkIfUsernameExist(req, res, next) {
    models.user.findOne({
        where: {
            'username':req.body.username
        }
    }).then( ( user) => {
      if (user) {
        res.status(400).send({error: "The username is in use."});
      }
    });
    next();
  }

  module.exports = router;