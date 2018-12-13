const express = require('express');

class groupRouter {
    constructor(groupSerivce) {
        this.groupSerivce = groupSerivce;

        let router = express.Router();

        router.get('/create/:name', (req, res) => { this.createGroup(req, res) })
        router.get('/chat/:id', (req, res) => { this.enterGroup(req, res) })
        router.get('/invite/:name&:group', (req,res)=>{this.inviteToGroup(req,res)})
        router.post('/receipe/', (req,res)=>{this.addReceipt(req,res)})

        this.router = router;
    }

    createGroup(req, res) {
        console.log(req.params.name)
        return this.groupSerivce.create(req, res, req.params.name, req.user[0].id) 
    }

    enterGroup(req, res) {
        console.log(req.params.id)
        return this.groupSerivce.get(req, res, req.params.id, req.user[0].id, req.user[0].displayName) 
    }

    inviteToGroup(req,res){
        console.log('req')
        console.log(req.params.name)
        console.log(req.params.group)
        return this.groupSerivce.invite(req,res,req.params.name,req.params.group)
    }

    addReceipt(req,res){
        console.log(req.body.tempReceipt)
        console.log(req.body.tempGroup)
        return this.groupSerivce.addReceipt(req,res,req.body.tempReceipt,req.body.tempGroup)
    }
}

module.exports = groupRouter;