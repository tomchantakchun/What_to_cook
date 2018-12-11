const router = require('express').Router();

const authCheck = (req, res, next) => {
    console.log('checking')
    console.log(req.user)
    if (!req.user){
        res.redirect('/auth/login');
    } else {
        next()
    }
}

router.get('/', authCheck, (req, res)=>{
    console.log('login')
    res.render('profile',  {
        user:req.user,
        name:req.user[0].userName,
        email: req.user[0].email,
        profilePic: req.user[0].profilePic 
    });
})

module.exports = router;