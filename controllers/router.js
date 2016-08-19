/*
Here is where you create all the functions that will do the routing for your app, and the logic of each route.
*/
var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var isLoggedIn = require('./authentication');
var models  = require('../models');
//var burger = require('../models/burger.js');

// =====================================
// HOME PAGE (with login links) ========
// =====================================
router.get('/', function(req, res) {
	res.render('index'); // load the index.ejs file
});

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
router.get('/login', function(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('login', {
		message: req.flash('loginMessage')
	});
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/group', // redirect to the secure sketch section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}),
	function(req, res) {
		if (req.body.remember) {
			req.session.cookie.maxAge = 1000 * 60 * 3;
		} else {
			req.session.cookie.expires = false;
		}
		res.redirect('/');
	});

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/signup', function(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('signup', {
		message: req.flash('signupMessage')
	});
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/group', // redirect to the secure sketch section
	failureRedirect: '/signup', // redirect back to the signup page if there is an error
	failureFlash: true // allow flash messages
}));

// =====================================
// GROUP SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/group', isLoggedIn, function(req, res) {
	// Get all groups that the user is in
	// models.Group.findAll({
 //    include: [ models.User ]
 //  }).then(function(groups) {
 //  	// Render all the groups
	//   res.render('group', {
	// 		group: groups // get the user out of session and pass to template
	// 	});
 //  }).error(function(err) {
 //    console.log(err);
 //  })
 res.render('group');
	
});

router.post('/group', isLoggedIn, function(req, res) {
	// Check if groupname exists
	models.Group.findOne({
    where: {groupname: req.body.groupname}
  }).then(function(group){

    // If groupname already found in database
    if (group !== null) {
    	res.render('group', {
    		message: 'That group is already taken.'
    	});
    }
    // Create if not
		models.Group.create({
	    groupname: req.body.groupname
	  }).then(function(group) {
	  	// Get sequelize user object
	  	// var userID = req.user.id;
	  	var sequelizeUser = models.User.findOne({
	  		where: {username: req.user.username}
	  	});
	  	console.log(sequelizeUser)
	  	// Then add user to group
	   //  group.addUser(sequelizeUser).then(function(user) {
		  //   console.log(user)
		  // }).error(function(err) {
		  //   console.log(err);
		  // })
	  }).error(function(err) {
	    done(err);
	  })

  }).error(function(err){
    done(err);
  });
	
	
});

// =====================================
// SKETCH SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/sketch', isLoggedIn, function(req, res) {
	res.render('sketch', {
		user: req.user // get the user out of session and pass to template
	});
});

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;