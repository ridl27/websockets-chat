// Make connection
var socket = io.connect();

// Query DOM
var message = document.getElementById('message'),
	handle = document.getElementById('handle'),
	btn = document.getElementById('send'),
	output = document.getElementById('output'),
	feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', { 
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(){  
    socket.emit('typing', handle.value);  
});

// Listen for events
socket.on('chat', function(data){
	if(data.length){
        for(let x = 0; x < data.length; x++){
            feedback.innerHTML = '';
    		output.innerHTML += '<p><strong>' + data[x].handle + ': </strong>' + data[x].message + '</p>';
        }
    }
});

socket.on('typing', function(data){  
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
