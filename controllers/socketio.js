/*
Here is where you create all the functions that will respond to the socket io for your app
*/

// Require and configure amazon web services
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3_config.json');
var s3Bucket = new AWS.S3({
	params: {
		Bucket: 'project2storyboard'
	}
});

// Require models for database
var models = require('../models');

// Socket io object to export
var returnSocket = function(io) {

	function socketIOEmit(obj) {
		io.sockets.emit(obj.groupname + 'next', obj); // io.sockets goes to all
	}

	io.on('connection', function(socket) {

		// When sketch is sent, receive data and send to AWS
		socket.on('send sketch', function(obj) {

			// Get data from obj
			var dataURL = obj.dataURL;
			var groupname = obj.groupname;
			var storyID = obj.storyID;
			var part = obj.part;

			// Create a new buffer for incoming dataURL
			buf = new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ""), 'base64')
			var data = {
				// Use groupname, storyID, and part to differentiate pictures
				Key: encodeURIComponent(groupname) + '/' + storyID + '/' + part,
				Body: buf,
				ContentEncoding: 'base64',
				ContentType: 'image/png'
			};

			// Send dataURL to s3
			s3Bucket.putObject(data, function(err, data) {
				if (err) {
					console.log(err);
					console.log('Error uploading data: ', data);
				} else {
					console.log('Succesfully uploaded the image!');

					// Increment part
					models.Group.findOne({
						where: {
							groupname: groupname
						}
					}).then(function(group) {

						// Check if part is 4
						var completed = group.dataValues.completed;
						var storyID = group.dataValues.storyID;
						var part = group.dataValues.part;

						if (part === 4) {

							// Increment completed and storyID by one and reset part
							group.updateAttributes({
								completed: completed + 1,
								storyID: storyID + 1,
								part: 1
							}).then(function() {

								// Save new story ID
								var newStoryID = storyID + 1;
								// Find the next captions
								models.Story.findOne({
									where: {storyID: newStoryID}
								}).then(function(nextStory) {

									// If end of stories has been reached
									if (nextStory === null) {

										// Update story id back to 1
										group.updateAttributes({
											storyID: 1
										}).then(function() {

											// Find first story
											models.Story.findOne({
												where: {storyID: 1}
											}).then(function(firstStory) {

												// Tells group to move to first story
												socketIOEmit({
													groupname: groupname, 
													storyID: 1, 
													part: 1,
													caption1: firstStory.dataValues.caption1,
													caption2: firstStory.dataValues.caption2,
													caption3: firstStory.dataValues.caption3,
													caption4: firstStory.dataValues.caption4
												});

											});

										});

									} 

									// Tells group to move to next story
									else {
										socketIOEmit({
											groupname: groupname, 
											storyID: newStoryID, 
											part: 1,
											caption1: nextStory.dataValues.caption1,
											caption2: nextStory.dataValues.caption2,
											caption3: nextStory.dataValues.caption3,
											caption4: nextStory.dataValues.caption4
										});
									}

								}).error(function(err) {
							    console.log(err);
							  })

							}).error(function(err) {
								console.log(err);
							})

						} 

						// Tells group to move to next part
						else {

							// Increment the part by one
							group.updateAttributes({
								part: part + 1
							}).then(function() {

								// Tells group to move to next part
								socketIOEmit({
									groupname: groupname, 
									storyID: storyID, 
									part: part + 1
								});

							}).error(function(err) {
								console.log(err);
							})
						}				

					}).error(function(err) {
						console.log(err);
					})

				}
			})

		})

	});

}

module.exports = returnSocket;