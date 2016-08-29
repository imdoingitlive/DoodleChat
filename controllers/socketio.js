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

	function socketIOEmit(groupname, newStoryID, story) {
		io.sockets.emit(groupname + 'next story', {
			storyID: newStoryID,
			part: 1,
			caption1: story.dataValues.caption1,
			caption2: story.dataValues.caption2,
			caption3: story.dataValues.caption3,
			caption4: story.dataValues.caption4,
		}); // io.sockets goes to all
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
						var part = group.dataValues.part;

						if (part === 4) {

							// Increment completed by one and reset part
							group.updateAttributes({
								completed: completed + 1,
								part: 1
							}).then(function() {

								// Save new story ID
								var newStoryID = completed + 2;
								// Find the next captions
								models.Story.findOne({
									where: {storyID: newStoryID}
								}).then(function(nextStory) {

									// If end of stories has been reached,
									if (nextStory === null) {

										// Find first story
										models.Story.findOne({
											where: {storyID: 1}
										}).then(function(firstStory) {
											// Tells group to move to first story
											socketIOEmit(groupname, 1, firstStory);
										});

									} else {
										// Tells group to move to next story
										socketIOEmit(groupname, newStoryID, nextStory);
									}									

								}).error(function(err) {
							    console.log(err);
							  })

							}).error(function(err) {
								console.log(err);
							})

						} else {
							// Increment the part by one
							group.updateAttributes({
								part: part + 1
							}).then(function() {

								// Tells group to move to next part
								io.sockets.emit(groupname + 'next part', {
									// storyID: completed + 1,
									part: part + 1
								}); // io.sockets goes to all

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