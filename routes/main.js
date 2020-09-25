const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');


router.get('/', (req, res) => {
	const title = 'Food Journal';
	res.render('index', { title: title }) // renders views/index.handlebars
});

router.get('/login', (req, res) =>{
	res.render('user/login');
})

router.get('/register', (req, res) =>{
	res.render('user/register');
})

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
