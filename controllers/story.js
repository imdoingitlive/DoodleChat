var models  = require('../models');

module.exports = function(req, res) {

	models.Story.findOne({
		where: {storyID: req.body.storyID}
	}).then(function(nextStory) {

		// If end of stories has been reached,
		if (nextStory === null) {

			// Find first story
			models.Story.findOne({
				where: {storyID: 1}
			}).then(function(firstStory) {
				// Create obj to send to client
				var obj = {
					storyID: 1,
					caption1: firstStory.dataValues.caption1,
					caption2: firstStory.dataValues.caption2,
					caption3: firstStory.dataValues.caption3,
					caption4: firstStory.dataValues.caption4,
				}
				// Send group name and group members
				res.json(obj);
			});

		} else {
			// Create obj to send to client
			var obj = {
				storyID: Number(req.body.storyID),
				caption1: nextStory.dataValues.caption1,
				caption2: nextStory.dataValues.caption2,
				caption3: nextStory.dataValues.caption3,
				caption4: nextStory.dataValues.caption4,
			}
			// Send group name and group members
			res.json(obj);
		}			


	}).error(function(err) {
    console.log(err);
  })
	
}