var models  = require('../models');

module.exports = function(req, res) {

	// Get sequelize user object
	models.User.findOne({
		where: {username: req.user.username}
	}).then(function(user) {

		// Get sequelize group object
		models.Group.findOne({
	    where: {groupname: req.body.groupname}
	  }).then(function(group) {

	  	// Check if total users is 4
	  	var totalusers = group.dataValues.totalusers;
	  	if (totalusers === 4) {
	  		res.json({message: 'Unable to join.  Group max reached.'});
	  		return
	  	}		  		

	  	// Increment the totalusers by one
			group.updateAttributes({
				totalusers: totalusers+1
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

	}).error(function(err) {
    console.log(err);
	})

}