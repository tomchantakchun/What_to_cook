const express = require('express');

class SearchRouter {
    constructor(searchService) {
        this.searchService = searchService;

        let router = express.Router();
        router.get('/', (req,res) => {this.getSearchPage(req,res)})
        router.get('/checkout', (req,res) => {this.getCheckoutPage(req,res)})
        router.post('/recipe', (req,res) => {this.searchRecipeResult(req,res)})
        router.post('/recipe-detail', (req,res) => {this.searchDetailRecipeResult(req,res)})
        // router.get('/cart', (req,res) => {this.retrieveCart(req,res)})
        // router.post('/cart', (req,res) => {this.addRecipeToCart(req,res)})
        // router.delete('/cart', (req,res) => {this.deleteRecipe(req,res)})
        // router.delete('/cartdeleteall', (req,res) => {this.deleteAllRecipe(req,res)})
        this.router = router;

        this.cart = {};
    }

    getSearchPage(req, res) {
<<<<<<< HEAD
        res.render('search',
        {
            no_need_logo:true,
            search:true,
            user:req.user
        });
    }

    getCheckoutPage(req, res) {
        res.render('checkout',
        {
            no_need_logo:true,
            checkout:true,
            user:req.user
        });
=======
        res.render('search',{page:'search'});
    }

    getCheckoutPage(req, res) {
        res.render('checkout');
>>>>>>> 8f69d572c1a2a398b6bc507ebbc218d97209f116
    }

    searchRecipeResult(req, res) {
        return this.searchService.search(req.body.data)
            .then((data) => {res.json(data)})
    }

    searchDetailRecipeResult(req, res) {
        return this.searchService.searchDetail(req.body.data)
            .then((data) => {res.json(data)})
    }

    // addRecipeToCart(req,res) {
    //     let i = 0;
    //     while (this.cart[i] !== undefined) {
    //         i++;
    //     }
    //     this.cart[i] = req.body;
    //     res.end()
    // }

    // retrieveCart(req,res) {
    //     res.json(this.cart);
    // }

    // deleteRecipe(req,res) {
    //     delete this.cart[req.body.item];
    //     res.end();
    // }

    // deleteAllRecipe(req,res) {
    //     this.cart = {};
    //     res.end();
    // }
}

module.exports = SearchRouter;
