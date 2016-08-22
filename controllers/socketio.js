/*
Here is where you create all the functions that will respond to the socket io for your app
*/

// Require and configure amazon web services
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'project2storyboard'} } );

// Require models for database
var models = require('../models');

// Socket io object to export
var returnSocket = function(io) {

	io.on('connection', function (socket) {

	  // When sketch is sent, receive data and send to AWS
	  socket.on('send sketch', function (dataURL,obj) {

	  	// Create a new buffer for incoming dataURL
	    buf = new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ""),'base64')
		  var data = {
		  	// Use groupname, storyID, and part to differentiate pictures
		    Key: encodeURIComponent(obj.groupname) + '/' + obj.storyID + '/' + obj.part,
		    Body: buf,
		    ContentEncoding: 'base64',
		    ContentType: 'image/png'
		  };
		  // Send dataURL to s3
		  s3Bucket.putObject(data, function(err, data){
		      if (err) { 
		        console.log(err);
		        console.log('Error uploading data: ', data); 
		      } else {
		        console.log('Succesfully uploaded the image!');
		      }
		  });
		  // Increment part
		  models.Group.findOne({
				where: {groupname: obj.groupname}
			}).then(function(group) {

				// Increment the part by one
				var part = group.dataValues.part;
				group.updateAttributes({
					part: part+1
				}).then(function() {

					// Force group to reload
					io.sockets.emit(obj.groupname + 'reload'); // io.sockets goes to all
					
				}).error(function(err) {
			    console.log(err);
			  })

			}).error(function(err) {
		    console.log(err);
		  })

	  });

	});

}

module.exports = returnSocket;