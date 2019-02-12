// back-end
var express = require('express');
var socket = require('socket.io');
var mongo = require('mongodb').MongoClient;

// App setup
var app = express();
var server = app.listen(process.env.PORT || 4000, function(){
    console.log('listening for requests');
});

// Static files
app.use(express.static('public'));

// Connect to mongo
mongo.connect('xxxxxx', function(err, db){

    if(err){
        throw err;
    }
    console.log('MongoDB connected...');

	// Socket setup 
	var io = socket(server);
	io.on('connection', (socket) => {

	    console.log('made socket connection', socket.id);

        let chat = db.collection('chats');
        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }
            // Emit the messages
            socket.emit('chat', res);
        });

	    // Handle chat event
	    socket.on('chat', function(data){
	    	let handle = data.handle;
            let message = data.message;

            // Insert message
            chat.insert({handle: handle, message: message}, function(){
                io.sockets.emit('chat', [data]);
            });
	    });

	    // Handle typing event
	    socket.on('typing', function(data){ 
	        socket.broadcast.emit('typing', data);  
	    });
	});
});