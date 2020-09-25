const express = require('express');
const router = express.Router();

const moment = require('moment');
const Food = require('../models/Food');
const ensureAuthenticated = require('../helpers/auth');
const alertMessage = require('../helpers/messenger');

// List videos belonging to curernt logged in user
// router.get('/listvideos', (req, res) => {
//     res.render('video/listVideos', { // pass object to listVideos.handlebar
//         videos: 'List of videos'
//     });
// });

router.get('/AddFood', ensureAuthenticated, (req, res) => {
    res.render('food/AddFood');
});

router.post('/addFood', ensureAuthenticated, (req, res)=>{
    let Entry = req.body.entry;
    let DateOfEntry = moment(req.body.dateOfEntry, 'DD/MM/YYYY');
    let Cuisine = req.body.cuisine.toString();
    let DiningPlace = req.body.diningPlace;
    let MealType = req.body.mealtype;
    let Calories = req.body.calories;
    let Mood = req.body.mood;
    let userId = req.user.id;

    Food.create({
        Entry,
        DateOfEntry,
        Cuisine,
        DiningPlace,
        MealType,
        Calories,
        Mood,
        userId
    })
    .then((food) =>{
        res.redirect('/food/listFood');
    })
    .catch(err=>console.log(err))
});

router.get('/listFood', ensureAuthenticated, (req, res)=>{
    Food.findAll({
        where:{
            userId:req.user.id
        },
        order:[
            ['id','ASC']
        ],
        raw:true
    })
    .then((food)=> {
        res.render('food/listFood',{food:food});
    })
    .catch(err=>console.log(err));
});

router.get('/edit/:id', ensureAuthenticated, (req,res)=>{
    Food.findOne({
        where:{
            id:req.params.id
        }
    }).then((food)=>{
        if (req.user.id === food.userId){
            checkOptions(food);
            res.render('food/editFood',{
                food
            });

        }else{
            alertMessage(res, 'danger', 'Unauthorised access. User did not create this entry.', 'fas fa exclamation-circle', true);
            res.redirect('/');
        }
                
    }).catch(err=>console.log(err));
});

function checkOptions(food){
    food.chineseFood = (food.Cuisine.search('Chinese')>=0)?'checked':'';
    food.americanFood = (food.Cuisine.search('American')>=0)?'checked':'';
    food.koreanFood = (food.Cuisine.search('Korean')>=0)?'checked':'';
    food.japFood = (food.Cuisine.search('Japanese')>=0)?'checked':'';
    food.malayFood = (food.Cuisine.search('Malay')>=0)?'checked':'';
    food.indianFood = (food.Cuisine.search('Indian')>=0)?'checked':'';
    food.otherFood = (food.Cuisine.search('Other')>=0)?'checked':'';

}

//save edited video
router.put('/saveEditedFood/:id', ensureAuthenticated, (req,res)=>{
	
	//retrieves edited values from req.body
    let Entry = req.body.entry;
    let DateOfEntry = moment(req.body.dateOfEntry, 'DD/MM/YYYY');
    let Cuisine = req.body.cuisine.toString();
    let DiningPlace = req.body.diningPlace;
    let MealType = req.body.mealtype;
    let Calories = req.body.calories;
    let Mood = req.body.mood;
    let userId = req.user.id;
    

	Food.update({
        Entry,
        DateOfEntry,
        Cuisine,
        DiningPlace,
        MealType,
        Calories,
        Mood,
        userId
    }, {
        where: {
            id:req.params.id
        }   
    }).then(()=>{
        res.redirect('/food/listFood');
    }).catch(err=>console.log(err));
});

//Delete video with authorization

router.get('/delete/:id', ensureAuthenticated, (req, res)=>{
    let foodId = req.params.id;
    let userId = req.user.id;
    
   
   Food.findOne({
        where:{
            id:foodId,
            userId:userId
        },
        attributes: ['id', 'userId']
    }).then((food)=>{
        
		// if record is found, user is owner of video
        
		if(food!=null){
            Food.destroy({
                where:{
                    id:foodId
                }
            }).then(()=>{
                alertMessage(res, 'info', 'Food entry deleted', 'far fa-trash-alt', true);
                res.redirect('/food/listFood'); // To retrieve all videos again
            }).catch(err =>console.log(err));
        }else{
            alertMessage(res, 'danger', 'Unauthorised access.', 'fas fa-exclamation-circle', true);
			res.redirect('/logout');
        }
    }).catch(err=>console.log(err));
});

module.exports = router;