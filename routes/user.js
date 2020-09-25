const express = require('express');
const router = require('./main');
const { success } = require('flash-messenger/Alert');
const rouer = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in the User model and Flash-messenger
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
//const passport = require('../config/passport');

// User register URL using HTTP POST => /user/register
// router.post('/user/register', (req, res) => {
//     let errors = [];
//     let = success_msg = '';

//     let password = req.body.password;
//     let password2 = req.body.password2;
//     let name = req.body.name;
//     let email = req.body.email;

//     if(password !== password2){
//         errors.push({text: 'Passwords do not match'});
//     }

//     if(password.length < 4){
//         errors.push({text: 'Password must be at least 4 characters'})
//     }

//     if(errors.length > 0){
//         res.render('user/register', {
//             errors: errors,
//             name: name,
//             email: email,
//             password: password,
//             password2: password2
//          });

//     }else{
//         success_msg = `${email} registered successfully`;
//         res.render('user/login', {success_msg: success_msg})
//     }

// });

router.post('/user/register', (req, res) => {
    let errors = [];
    let = success_msg = '';

    // Retrieves fiels from register page from request body
    let {name, email, age, password, password2} = req.body;

    if (age == 0){
        errors.push({text: 'Age does not meet minimum in Terms of Service.'});
    }else if (age < 0) {
        errors.push({text: 'Age is negative.'});
    }

    if(password !== password2){
        errors.push({text: 'Passwords do not match'});
    }

    if(password.length < 8){
        errors.push({text: 'Password must be at least 8 characters'})
    }

    // Check for password complexity

    //checkString = "0"
    checkLower = "0"
    checkUpper = "0"
    checkSpecial = "0"

    var lower = "abcdefghijklmnopqrstuvwxyz";
    var upper = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
    var special = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";

    for(i = 0; i < lower.length;i++){
        if(password.indexOf(lower[i]) > -1){
            checkLower = "1"
            //return true
        }
    }

    for(i = 0; i < upper.length;i++){
        if(password.indexOf(upper[i]) > -1){
            checkUpper = "1"
            //return true
        }
    }

    for(i = 0; i < special.length;i++){
        if(password.indexOf(special[i]) > -1){
            checkSpecial = "1"
            //return true
        }
    }

    if (checkLower == "0" || checkLower == "0" || checkLower == "0"){
        errors.push({text: 'Password does not meet complexity. Passwords must be at least 8 characters. Includes lower, upper case, and special characters.'})
    }

    // Check for password complexity

    if(errors.length > 0){
        res.render('user/register', {
            errors,
            name,
            email,
            age,
            password,
            password2
        });
    }else{
        // If all is well, checkes if user is already been registered
        User.findOne({ where: {email: req.body.email}})
            .then(user => {
                //if (user) {
                if (user != null && user != '') {
                    // If user is found, that means email has already been registered
                    res.render('user/register', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        age,
                        password,
                        password2
                    });
                }else{
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(password, salt, (err, hash)=>{
                            if(err) throw err;
                            password = hash;

                            // Create new user record
                            User.create({ name, email, age, password })
                            .then(user => {
                                alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));

                        })
                    })
                    // // Create new user record
                    // User.create({ name, email, password })
                    // .then(user => {
                    //     alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                    //     res.redirect('/showLogin');
                    // })
                    // .catch(err => console.log(err));
                }
                console.log(typeof user);
                console.log(user);
            });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/food/listFood', // Route to /videos/list/Videos URL
        failureRedirect: '/login', // Route to /login URL
        failureFlash: true
    })(req, res, next);
});



module.exports = router;