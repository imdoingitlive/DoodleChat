var models  = require('../models');

module.exports = function(req, res) {

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
		// Create a loop through function that is called recursively
	}).then(function loopThrough(recentGroups, counter) {
			// Set counter
			if (counter === undefined) counter = 0;
			if (counter >= recentGroups.length) return;
			// Get groupname and totalusers
			var obj = {
				groupname: recentGroups[counter].dataValues.groupname,
				totalusers: recentGroups[counter].dataValues.totalusers
			}
			// Check if total users is reached
			if (obj.totalusers === 4) {
	  		obj.joined = true; // Even though not actually joined, it does not display ability to join
	  		// Push obj to recent groups
	    	hbsObject.recentGroups.push(obj);
	    	// Recursion
	    	counter++;
	    	loopThrough(recentGroups, counter)
	  	} else {
	  		// Check if user is in group
	    	recentGroups[counter].getUsers({where : {username: req.user.username}}).then(function(results) {
	    		// If no result, not used yet
		    	if (results.length === 0)
		    		obj.joined = false;
		    	else
		    		obj.joined = true;
		    	// Push obj to recent groups
		    	hbsObject.recentGroups.push(obj);
		    	// Recursion
		    	counter++;
		    	loopThrough(recentGroups, counter)
	    	})
	  	}				

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
		
}