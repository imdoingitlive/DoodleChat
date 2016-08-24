var models  = require('../models');
var bcrypt = require('bcrypt-nodejs');

module.exports = function() {

	models.Group.create({
    groupname: 'test'
  }).then(function(group) {

  	models.User.create({
	    username: 'user1',
	    password: bcrypt.hashSync('test', null, null) // use the generateHash function in our user model
	  }).then(function(user) {
	  	return group.addUser(user)
	  })

	  .then(function() {
	  	return models.User.create({
		    username: 'user2',
		    password: bcrypt.hashSync('test', null, null) // use the generateHash function in our user model
		  }).then(function(user) {
		  	return group.addUser(user)
		  })
	  })

	  .then(function() {
	  	return models.User.create({
		    username: 'user3',
		    password: bcrypt.hashSync('test', null, null) // use the generateHash function in our user model
		  }).then(function(user) {
		  	return group.addUser(user)
		  })
	  })

	  .then(function() {
	  	return models.User.create({
		    username: 'user4',
		    password: bcrypt.hashSync('test', null, null) // use the generateHash function in our user model
		  }).then(function(user) {
		  	return group.addUser(user)
		  })
	  })
  })

}