var models  = require('../models');
var bcrypt = require('bcrypt-nodejs');

module.exports = function() {

	models.Group.create({
    groupname: 'test',
    totalusers: 4
  }).then(function(group) {

  	models.User.create({
	    username: 'user1',
	    password: bcrypt.hashSync('test', null, null) // use the generateHash function in our user model
	  }).then(function(user1) {
	  	return group.addUser(user1)
	  })

	  .then(function() {
	  	return models.User.create({
		    username: 'user2',
		    password: bcrypt.hashSync('test', null, null) // use the generateHash function in our user model
		  }).then(function(user2) {
		  	return group.addUser(user2)
		  })
	  })

	  .then(function() {
	  	return models.User.create({
		    username: 'user3',
		    password: bcrypt.hashSync('test', null, null) // use the generateHash function in our user model
		  }).then(function(user3) {
		  	return group.addUser(user3)
		  })
	  })

	  .then(function() {
	  	return models.User.create({
		    username: 'user4',
		    password: bcrypt.hashSync('test', null, null) // use the generateHash function in our user model
		  }).then(function(user4) {
		  	return group.addUser(user4)
		  })
	  })
  })

}