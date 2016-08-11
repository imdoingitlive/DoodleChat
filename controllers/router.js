/*
Here is where you create all the functions that will do the routing for your app, and the logic of each route.
*/
var express = require('express');
var router = express.Router();
var path = require('path');
//var burger = require('../models/burger.js');

router.get('/', function (req, res) {
	res.sendFile(path.resolve('public/assets/sketch.html'));
});

module.exports = router;