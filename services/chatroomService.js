
const knex = require('knex')({
  client: 'postgresql',
  connection: {
      database: 'WhatToEat',
      user: 'admin',
      password: 'admin'
  }
});

exports = module.exports = function (io) {
  var currentUser
  var currentRoom 
  var profilePic
  io.on('connection', function (socket) {
    console.log('connection received');
    console.log('userid =' + socket.request._query.data.split(",")[0])//userid
    console.log('groupid =' + socket.request._query.data.split(",")[1])//groupid

    socket.on('chat message', function (msg) {
      currentUser = socket.request._query.data.split(",")[0];
      currentRoom = socket.request._query.data.split(",")[1];
      console.log("Received ", msg + 'from' + currentUser + 'in' + currentRoom);
      knex("chat").insert(
        {
            userid: currentUser,
            groupid: currentRoom,
            record: msg,
        }).then(()=>{})
    this.query2 = knex('users').select('profilePic').where('id', currentUser)
    this.query2.then((data)=>{
      profilePic = data[0].profilePic;
    console.log(profilePic);
    io.to(currentRoom).emit('chat message', msg, currentUser, profilePic)
  })
    
  })

    socket.on('disconnect', function () {
      io.emit('user disconnected');
    });

    socket.on('subscribe', (room) => {
      console.log('you have subsribe to' + room)
      socket.join(room);
    });

  })

}