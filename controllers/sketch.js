var models  = require('../models');

module.exports = function(req, res) {

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
				storyID: group.dataValues.storyID,
				part: group.dataValues.part
			}

			// Go through all the users and add usernames
    	for (var i in users) {
    		// Add all usernames to group
    		obj.groupmembers.push(users[i].dataValues.username)
    	}

    	// Send group name and group members
			res.json(obj);

		}).error(function(err) {
	    console.log(err);
	  })

	}).error(function(err) {
    console.log(err);
  })
	
}