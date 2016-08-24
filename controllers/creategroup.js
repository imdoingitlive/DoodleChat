var models  = require('../models');

module.exports = function(req, res) {

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
	
}