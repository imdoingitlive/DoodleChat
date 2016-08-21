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

// Wrap router in function call so io can be used
var returnRouter = function(io) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	router.get('/', function(req, res) {
		res.render('index');
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
			successRedirect: '/groups', // redirect to the secure sketch section
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
		successRedirect: '/groups', // redirect to the secure sketch section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// =====================================
	// GROUP SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/groups', isLoggedIn, function(req, res) {

		// Get sequelize user object
		models.User.findOne({
			where: {username: req.user.username}
		}).then(function(user) {

			// Retrieve all groups from user
			user.getGroups().then(function(groups) {
				// Create handlbears object for group
				var hbsObject = {
					username: req.user.username,
					groupids: [],
					groupnames: []
				};
				for (var i in groups) {
					hbsObject.groupids.push(groups[i].dataValues.id);
					hbsObject.groupnames.push(groups[i].dataValues.groupname);
				}
				// Render group page with groups
	  		res.render('groups', hbsObject);
			})

		}).error(function(err) {
	    console.log(err);
	  })
		
	});

	// When hitting find group button
	router.post('/findgroup', isLoggedIn, function(req, res) {

		// If groupname is empty in database
	  if (req.body.groupname === '') {
	  	res.json({message: 'Please enter a non empty group name.'});
	  	return
	  }

		// Check if groupname exists
		models.Group.findOne({
	    where: {groupname: req.body.groupname}
	  }).then(function(group){

	    // If groupname already found in database
	    if (group === null) {
	    	res.json({message: 'That group does not exist.'});
	    	return
	    }

	    // Check if user is in group
	    group.getUsers().then(function(results) {
	    	var obj = {
	    		group: group.dataValues.groupname
	    	};
	    	// Go through all the users to see if user is in group
	    	for (var i in results) {
	    		if (results[i].dataValues.username === req.user.username) {
	    			obj.joined = true;
	    		}
	    	}
	    	// If user is not in group add false object
	    	if (!obj.joined) {
	    		obj.joined = false;
	    	}
	    	// Send groupname
	  		res.json(obj);
	    })

	  }).error(function(err){
	    console.log(err);
	  });
		
	});

	// When hitting join group button
	router.post('/joingroup', isLoggedIn, function(req, res) {

		// Get sequelize user object
		models.User.findOne({
			where: {username: req.user.username}
		}).then(function(user) {

			// Get sequelize group object
			models.Group.findOne({
		    where: {groupname: req.body.groupname}
		  }).then(function(group) {

				// Associate user with group
				group.addUser(user).then(function() {

					// Send group name
					res.json({group: group.dataValues.groupname});

				}).error(function(err) {
			    console.log(err);
			  })

			}).error(function(err) {
		    console.log(err);
		  })

		}).error(function(err) {
	    console.log(err);
	  })
		
	});

	// When hitting create group button
	router.post('/creategroup', isLoggedIn, function(req, res) {

		// If groupname is empty in database
	  if (req.body.groupname === '') {
	  	res.json({message: 'Please enter a non empty group name.'});
	  	return
	  }

		// Check if groupname exists
		models.Group.findOne({
	    where: {groupname: req.body.groupname}
	  }).then(function(group){

	    // If groupname already found in database
	    if (group !== null) {
	    	res.json({message: 'That group is already taken.'});
	    	return
	    }
	    // Create if not and add user
			models.Group.create({
		    groupname: req.body.groupname
		  }).then(function(newGroup) {

		  	// Get sequelize user object
		  	models.User.findOne({
		  		where: {username: req.user.username}
		  	}).then(function(user) {

		  		// Associate user with group
		  		user.addGroup(newGroup).then(function() {

		  			// Send group name
		  			res.json({group: newGroup.dataValues.groupname});

		  		}).error(function(err) {
				    console.log(err);
				  })
		  		

		  	}).error(function(err) {
			    console.log(err);
			  })

		  }).error(function(err) {
		    console.log(err);
		  })

	  }).error(function(err){
	    console.log(err);
	  });
		
	});

	// =====================================
	// SKETCH SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/sketch/:groupname', isLoggedIn, function(req, res) {

		var groupname = req.params.groupname;

		// Get sequelize group object
			models.Group.findOne({
		    where: {groupname: groupname}
		  }).then(function(group) {

				// Associate user with group
				group.getUsers().then(function(results) {

					var obj = {
						username: req.user.username,
						groupname: groupname,
						groupmembers: []
					}

					// Go through all the users and add usernames
		    	for (var i in results) {
		    		// Add all usernames to group
		    		obj.groupmembers.push(results[i].dataValues.username)
		    	}

		    	// Emit the newest user
		    	io.sockets.emit('new user', req.user.username);

					// Send group name and group members
					res.render('sketch', obj);

				}).error(function(err) {
			    console.log(err);
			  })

			}).error(function(err) {
		    console.log(err);
		  })
		
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// Return router for exporting with io
	return router
}

module.exports = returnRouter;