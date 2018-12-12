const router = require('express').Router();
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: 'WhatToEat',
        user: 'admin',
        password: 'admin'
    }
});

class groupService{
    //create a group
    create(req, res, newName, userId){
        this.query = knex.select('*').from('groups').where('groups', newName);
        this.query.then((group) => {
            //check duplicate
            if (group.length === 1) {
                req.flash('error_msg', 'The username has been taken. Be creative!')
            } else { 
                //add group
                console.log('adding group')
                knex("groups").insert(
                    {
                        groups: newName
                    }
                ).then(() => {
                    //pair up the creater and group
                    this.query2 = knex.select('*').from('groups').where('groups', newName).then((NewGroup) => {
                        console.log(userId)
                        knex("groupsusers").insert({
                            userid: userId,
                            groupid: NewGroup[0].id
                        }).then(()=>{
                            res.redirect('/lobby')
                        })
                    })
                })
            }
        })
    }
    //end of create a group

    //get group
    get(req,res, groupid, userid){
        this.query = knex.select('*').from('chat').where('groupid', groupid);
        this.query.then((chatrecord)=>{
            console.log(chatrecord);
            console.log(userid);
            res.render('chatroom', {userid:userid, chatrecord:chatrecord, groupid:groupid})
        })
    }
}

module.exports = groupService