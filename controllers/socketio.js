/*
Here is where you create all the functions that will respond to the socket io for your app
*/

// Require and configure amazon web services
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'myBucket'} } );

// Socket io object to export
var socketio = {};

socketio.connection = function (socket) {
	// First emit data
  //socket.emit('sketch');
  // When sketch is sent, receive data and send to AWS
  socket.on('my sketch', function (data) {
    console.log(data);
  });
}

module.exports = socketio;