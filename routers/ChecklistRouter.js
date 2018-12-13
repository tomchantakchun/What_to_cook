const express = require('express');

class ChecklistRouter {
    constructor(checklistservice) {
        this.checklistservice = checklistservice;

        let router = express.Router();
        router.get('/', (req, res) => { this.getChecklistPage(req, res) })
        router.post('/ingredients', (req, res) => { this.getIngredients(req, res) })
        router.post('/category', (req, res) => { this.getCategory(req, res) })
        router.post('/online-shopping', (req, res) => { this.scrapOnlineShoppingData(req, res) })
        this.router = router;
    }

    getChecklistPage(req, res) {
        res.render('checklist',
        {
            no_need_logo:true,
            checklist:true,
            user:req.user
        });
    }

    getIngredients(req, res) {
        return this.checklistservice.searchIngredients(req.body.labelList)
            .then((data) => { res.json(data) })
    }

    getCategory(req, res) {
        return this.checklistservice.searchCategory(req.body.ingredientLine)
            .then((data) => { res.json([data[0]['category'], req.body.ingredientLine]) })
    }

    async scrapOnlineShoppingData(req, res) {
        return await this.checklistservice.fetchCitySuper(req.body.category)
            .then((data) => { res.json(data) })
    }

    
}

module.exports = ChecklistRouter;