module.exports = function(io){
    var meetupNamespace = io.of('/meetup').on("connection",function(socket){
        console.log("Application connected");

        socket.on('disconnect',function(){
            console.log("Application Disconnected");
        });

        socket.on('meetup added',function(meetup){
            console.log("New Meetup added :"+meetup);
            meetupNamespace.emit('new meetup',meetup);
        });

        socket.on('meetup updated',function(meetup){
            console.log("Meetup Updated :"+meetup);
            meetupNamespace.emit('edit meetup',meetup);
        });

        socket.on('meetup deleted',function(meetup){
            console.log("Meetup Deleted :"+meetup);
            meetupNamespace.emit('delete meetup',meetup);
        });

    });
}