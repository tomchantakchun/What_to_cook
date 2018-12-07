const router = require('express').Router();
const passport = require('passport');

//auth login

router.get('/login',(req,res)=>{
    res.render('login');
});

//auth logout

router.get('/logout',(req,res)=>{
    //handle with passport
    res.send('logging out')
});


//auth with google

router.get('/google', passport.authenticate('google',{
    scope: ['profile','email']
}));

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'),(req,res)=>{
    console.log('reditecting');
    res.redirect('/profile')
})

//auth with facebook

router.get('/facebook', passport.authenticate('facebook',{scope: ['email'] }
), (req, res)=>{console.log('facebook authenticating')}
);

//callback route for google to redirect to
router.get('/facebook/redirect', passport.authenticate('facebook'), (req,res)=>{
    console.log('reditecting');
    res.redirect('/profile')
})

//auth with Local

// router.get('/local', passport.authenticate('local'));

// //callback route for local to redirect to
// router.get('/local/redirect', passport.authenticate('local'),(req,res)=>{
//     res.redirect('/profile')
// })

module.exports = router;