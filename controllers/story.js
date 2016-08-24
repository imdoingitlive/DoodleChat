var models  = require('../models');

module.exports = function(req, res) {

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
	
}