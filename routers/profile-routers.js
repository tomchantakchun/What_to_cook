const router = require('express').Router();

const authCheck = (req, res, next) => {
    console.log('checking')
    if (!req.user){
        res.redirect('/auth/login');
    } else {
        next()
    }
}

router.get('/', authCheck, (req, res)=>{
    console.log('login')
    res.send('you are logged in' + req.user[0].userName + 'testing')
})

module.exports = router;