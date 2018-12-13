const express = require('express');

class SearchRouter {
    constructor(searchService) {
        this.searchService = searchService;

        let router = express.Router();
        router.get('/', (req,res) => {this.getSearchPage(req,res)})
        router.get('/checkout', (req,res) => {this.getCheckoutPage(req,res)}, (req,res) => {this.goToCheckoutPage(req,res)})
        router.post('/recipe', (req,res) => {this.searchRecipeResult(req,res)})
        router.post('/recipe-detail', (req,res) => {this.searchDetailRecipeResult(req,res)})
        router.get('/cart', (req,res) => {this.retrieveCart(req,res)})
        router.post('/cart', (req,res) => {this.addRecipeToCart(req,res)})
        this.router = router;

        this.cart = [];
    }

    getSearchPage(req, res) {
        res.render('search');
    }

    getCheckoutPage(req, res) {
        res.render('checkout');
    }

    searchRecipeResult(req, res) {
        return this.searchService.search(req.body.data)
            .then((data) => {res.json(data)})
    }

    searchDetailRecipeResult(req, res) {
        return this.searchService.searchDetail(req.body.data)
            .then((data) => {res.json(data)})
    }

    addRecipeToCart(req,res) {
        this.cart.push(req.body);
        res.end()
    }

    retrieveCart(req,res) {
        console.log(this.cart)
        res.json(this.cart);
        this.cart = [];
    }
}

module.exports = SearchRouter;
