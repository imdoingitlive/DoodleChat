/*
Here is where you create all the functions that will do the routing for your app, and the logic of each route.
*/
var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');
var isLoggedIn = require('./authentication');
var models  = require('../models');

// Controllers
var login = require('./login');
var signup = require('./signup');
var groups = require('./groups');
var findgroup = require('./findgroup');
var joingroup = require('./joingroup');
var creategroup = require('./creategroup');
var sketch = require('./sketch');
var story = require('./story');

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
	router.post('/login', login);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// process the signup form
	router.post('/signup', signup);

	// =====================================
	// GROUP SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/groups', isLoggedIn, groups);

	// When hitting find group button
	router.post('/findgroup', isLoggedIn, findgroup);

	// When hitting join group button
	router.post('/joingroup', isLoggedIn, joingroup);

	// When hitting create group button
	router.post('/creategroup', isLoggedIn, creategroup);

	// =====================================
	// SKETCH SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/sketch/:groupname', isLoggedIn, sketch, function(req, res) {
		// Emit the newest user
  	io.sockets.emit(req.params.groupname + 'new user', req.user.username);
	});

	// AJAX request for story
	router.post('/sketch/:groupname/story', isLoggedIn, story);

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