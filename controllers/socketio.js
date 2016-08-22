/*
Here is where you create all the functions that will respond to the socket io for your app
*/

// Require and configure amazon web services
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'project2storyboard'} } );

// Socket io object to export
var socketio = {};

socketio.connection = function (socket) {

  // When sketch is sent, receive data and send to AWS
  socket.on('send sketch', function (dataURL,key) {

  	// Create a new buffer for incoming dataURL
    buf = new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ""),'base64')
	  var data = {
	    Key: key,
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

  });

}

module.exports = socketio;