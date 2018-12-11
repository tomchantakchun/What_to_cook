const express = require('express');

class groupRouter {
    constructor(groupSerivce) {
        this.groupSerivce = groupSerivce;

        let router = express.Router();

        router.get('/create/:name', (req, res) => { this.createGroup(req, res) })
        router.get('/chat/:id', (req, res) => { this.enterGroup(req, res) })
        this.router = router;
    }

    createGroup(req, res) {
        console.log(req.params.name)
        return this.groupSerivce.create(req, res, req.params.name, req.user[0].id) 
    }

    enterGroup(req, res) {
        console.log(req.params.id)
        return this.groupSerivce.get(req, res, req.params.id, req.user[0].id) 
    }
}

module.exports = groupRouter;