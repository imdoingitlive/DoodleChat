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
	// First emit data
  //socket.emit('sketch');
  // When sketch is sent, receive data and send to AWS
  socket.on('my sketch', function (dataURL) {

    console.log(dataURL);
    buf = new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ""),'base64')
	  var data = {
	    Key: 'test2', // req.body.userId, 
	    Body: buf,
	    ContentEncoding: 'base64',
	    ContentType: 'image/png'
	  };
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