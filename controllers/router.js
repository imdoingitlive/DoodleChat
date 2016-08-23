/*
Here is where you create all the functions that will do the routing for your app, and the logic of each route.
*/
var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');
var isLoggedIn = require('./authentication');
var models  = require('../models');

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
	// process the login form
	router.post('/login', function(req, res, next) {
		// If not authenticate
		passport.authenticate('local-login', function(err, user, info) {
			if (err) return next(err);
			if (!user) return res.json(info);
			req.logIn(user, function(err) {
				if (err) return next(err);
				return res.json({redirect: '/groups'});
			});
		}) (req, res, next)
	}, function(req, res, next) {
    // issue a remember me cookie if the option was checked
    if (!req.body.remember_me) { return next(); }

    var token = utils.generateToken(64);
    Token.save(token, { userId: req.user.id }, function(err) {
      if (err) { return done(err); }
      res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
      return next();
    });
  },
  function(req, res) {
    res.redirect('/');
  });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// process the signup form
	router.post('/signup', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
			if (err) return next(err);
			if (!user) return res.json(info);
			req.logIn(user, function(err) {
				if (err) return next(err);
				return res.json({redirect: '/groups'});
			});
		}) (req, res, next)
	});

	// =====================================
	// GROUP SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/groups', isLoggedIn, function(req, res) {

		// Create obj for rendering
		var hbsObject = {
			username: req.user.username,
			recentGroups: [],
			userGroups: []
		};

		// Find most recently created groups
		models.Group.findAll({
			limit: 5,
			order: 'created_at DESC'
		}).then(function(recentGroups){
			// Add recent groups
			for (var i in recentGroups) {
				var obj = {
					groupname: recentGroups[i].dataValues.groupname,
					totalusers: recentGroups[i].dataValues.totalusers
				}
				hbsObject.recentGroups.push(obj);
			}
			return
		}).then(function() {
			// Get sequelize user object
			models.User.findOne({
				where: {username: req.user.username}
			}).then(function(user) {

				// Retrieve all groups from user
				user.getGroups().then(function(groups) {
					// Add user's groups
					for (var i in groups) {
						var obj = {
							groupname: groups[i].dataValues.groupname,
							totalusers: groups[i].dataValues.totalusers
						}
						hbsObject.userGroups.push(obj);
					}
					// Render group page with groups
		  		res.render('groups', hbsObject);
				}).error(function(err) {
			    console.log(err);
			  })

			}).error(function(err) {
		    console.log(err);
		  })
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
	    		groupname: group.dataValues.groupname,
	    		totalusers: group.dataValues.totalusers
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

		  	// Increment the totalusers by one
				var totalusers = group.dataValues.totalusers;
				return group.updateAttributes({
					totalusers: totalusers+1
				})

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

	  // Groupname validation
		var regex = /^[a-zA-Z0-9]+$/;
	  if(!req.body.groupname.match(regex)) {
	  	res.json({message: 'Please only use alpha-numeric characters with no spaces'});
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
			group.getUsers().then(function(users) {

				var obj = {
					username: req.user.username,
					groupname: groupname,
					groupmembers: [],
					completed: group.dataValues.completed,
					part: group.dataValues.part
				}

				// Go through all the users and add usernames
	    	for (var i in users) {
	    		// Add all usernames to group
	    		obj.groupmembers.push(users[i].dataValues.username)
	    	}

	    	// Emit the newest user
	    	io.sockets.emit(groupname + 'new user', req.user.username);

				// Send group name and group members
				res.render('sketch', obj);

			}).error(function(err) {
		    console.log(err);
		  })

		}).error(function(err) {
	    console.log(err);
	  })
		
	});

	// AJAX request for story
	router.post('/sketch/:groupname/story', isLoggedIn, function(req, res) {

		var completed = req.body.completed;

		models.Story.findOne({
  		where: {storyID: completed+1}
  	}).then(function(stories) {

  		var obj = {
				caption1: stories.dataValues.caption1,
				caption2: stories.dataValues.caption2,
				caption3: stories.dataValues.caption3,
				caption4: stories.dataValues.caption4,
			}

			// Send group name and group members
			res.json(obj);

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