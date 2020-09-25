const express = require('express');
const router = express.Router();

const moment = require('moment');
const User = require('../models/User');
const ensureAuthenticated = require('../helpers/auth');
const alertMessage = require('../helpers/messenger');

router.get('/editProfile/:id', ensureAuthenticated, (req,res)=>{
    User.findOne({
        where:{
            id:req.params.id
        }
    }).then((user)=>{
        if(!user){
            console.log('not found!');
            alertMessage(res, 'danger', 'Unauthorised access.', 'fas fa exclamation-circle', true);
            res.redirect('/');
        }
        else if (req.user.id === user.id){
            console.log('found!');
            res.render('profile/editProfile',{
                user
            });

        }else{
            console.log('not found!');
            alertMessage(res, 'danger', 'Unauthorised access.', 'fas fa exclamation-circle', true);
            res.redirect('/');
        }
                
    }).catch(err=>console.log(err));
});


router.put('/saveProfile/:id', ensureAuthenticated, (req,res)=>{
	
    //retrieves edited values from req.body
    let userId = req.user.id;
    let name  = req.user.name;
    let email = req.user.email;
    let age = req.user.age;
    let password = req.user.password;
    let weight = req.body.weight;
    let height = req.body.height;

    bmiCalc = weight / (height*height);
    console.log(bmiCalc);

    let bmi = bmiCalc;

	User.update({
        name,
        email,
        password,
        age,
        password,
        weight,
        height,
        bmi
    }, {
        where: {
            id:req.params.id
        }   
    }).then(()=>{
        res.redirect('/');
    }).catch(err=>console.log(err));
});

module.exports = router;