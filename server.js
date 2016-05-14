var express = require('express');
app = express();
var fs = require('fs');
var credentials = {
	key:  fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem')
};
var https = require('http');
var HOST = process.env.IP || 'localhost';
app.set('port', process.env.PORT || 4200);
var server = https.createServer(app).listen(app.get('port'), () => {
	console.log("Socket server listening on https://%s:%s", HOST, app.get('port'));
});

// routes
app.get('/', function(req, res) {
	// res.sendFile(__dirname + '/dashboard.html');
	res.send("Received GET request");
});

// web-sockets
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
	socket.emit('test', {message: "Test message from server"});
	socket.on('test', function(data) {
		console.log(data.message);
	});
	socket.on('offer', function(data) {
		socket.broadcast.emit('offer', data);
	});
	socket.on('answer', function(data) {
		socket.broadcast.emit('answer', data);
	});
	socket.on('ice', function(data) {
		socket.broadcast.emit('ice', data);
	});
	socket.on('hangup', function(data) {
		socket.broadcast.emit('hangup', data);
	});
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('webrtc', function(data) {
		socket.broadcast.emit('webrtc', data);
	});
});