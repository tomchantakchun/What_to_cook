
exports = module.exports = function(io){
var userId;

io.on('connection', function (socket) {
    console.log('connection received');
    var currentRoom;
    var currentUser;
    currentUser = userId++;
    socket.on('chat message', function (msg) {
      console.log("Received ", msg);
      console.log(this.userId)
      if (currentRoom) {
        io.to(currentRoom).emit('chat message', "reply from server " + msg + ' server ' + currentRoom + ' from ' +   this.userId)
      }
      else {
        io.to(socket.id).emit('chat message', "reply from server " + msg + ' defaultserver ' + ' from ' +   this.userId)
      }
    }
    )
  
    socket.on('disconnect', function () {
      io.emit('user disconnected');
    });
  
    socket.on('subscribe', (room) => {
      if (currentRoom) {
        socket.leave(currentRoom)
        socket.join(room);
        console.log(room);
        currentRoom = room;
      } else {
        socket.join(room);
        console.log(room);
        currentRoom = room;
      }
    });
  
  })

}