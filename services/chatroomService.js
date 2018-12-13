
const knex = require('knex')({
  client: 'pg',
  connection: {
<<<<<<< HEAD
      host:process.env.RDS_ENDPOINT,
      database: process.env.RDS_DB_NAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD
=======
      database: 'WhatToEat',
      user: 'admin',
      password: 'admin'
>>>>>>> 8f69d572c1a2a398b6bc507ebbc218d97209f116
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
    this.query2 = knex('users').select('profilePic','displayName').where('id', currentUser)
    this.query2.then((data)=>{
      profilePic = data[0].profilePic;
      displayName = data[0].displayName;
    console.log(profilePic);
    io.to(currentRoom).emit('chat message', msg, currentUser, displayName, profilePic)
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