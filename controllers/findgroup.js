var models  = require('../models');

module.exports = function(req, res) {

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
    // Create obj to send back to client
  	var obj = {
  		groupname: group.dataValues.groupname,
  		totalusers: group.dataValues.totalusers
  	};
  	// Check if total users is reached
		if (obj.totalusers === 4) {
  		obj.joined = true; // Even though not actually joined, it does not display ability to join
  		// Send groupname
  		res.json(obj);
  		return
  	} else {
	  	// Check if user is in group
	    group.getUsers({where : {username: req.user.username}}).then(function(results) {

	    	// If no result, not used yet
	    	if (results.length === 0)
	    		obj.joined = false;
	    	else
	    		obj.joined = true;
	    	// Send groupname
	  		res.json(obj);

	    }).error(function(err){
		    console.log(err);
		  });
	  }

  }).error(function(err){
    console.log(err);
  });

}