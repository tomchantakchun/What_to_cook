const router = require('express').Router();
const passport = require('passport');

//bust those who loggin in already
const authCheck = (req, res, next) => {
    console.log('checking')
    if (req.user){
        res.redirect('/');
    } else {
        next()
    }
}

//auth login

router.get('/login', authCheck, (req, res) => {
    res.render('login', {user:req.user});
});

//auth logout

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});


//auth with google

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log('reditecting');
    res.redirect('/profile')
})

//auth with facebook

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }
), (req, res) => { console.log('facebook authenticating') }
);

//callback route for google to redirect to
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    console.log('redirecting');
    res.redirect('/profile')
})

//auth with Local

router.post('/local', passport.authenticate('local',{
    successRedirect: '/profile',
    failureRedirect: '/auth/login'
}))

router.get('/local/redirect', passport.authenticate('local'), (req, res) => {
    console.log('redirecting');
    res.redirect('/profile')
})

module.exports = router;