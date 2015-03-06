module.exports = function(io){
    var chatNamespace = io.of('/chat').on("connection",function(socket){

        console.log("###### application connected with socketId : "+socket.id);

        socket.on('disconnect',function(){
            console.log("Application Disconnected with socket id : "+socket.id);
        });

        socket.on('send',function(chatData){
            console.log("New message received :"+chatData);
            socket.broadcast.emit('chatmessage',chatData);
        });

        socket.on('typing',function(chatData){
            console.log("New message received :"+chatData);
            socket.broadcast.emit('typing',chatData);
        });

        socket.on('typing:stopped',function(chatData){
            socket.broadcast.emit('typing:stopped',chatData);
        });
    });
}