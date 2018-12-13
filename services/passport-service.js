const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv').config();
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: 'delish-recipe',
        user: 'postgres',
        password: 'postgres'
    }
});

passport.serializeUser((user, done) => {
    console.log('serialize');
    if (user[0].id) {
        done(null, user[0].id);
    } else if (user.id) {
        done(null, user.id)
    } else {
        console.log('problem')
    }
})

passport.deserializeUser((id, done) => {
    console.log('deserialize');
    knex.select('*').from('users').where('id', id).then((user) => {
        done(null, user);
    })
})

passport.use(
    new GoogleStrategy({
        //option for google strategy
        callbackURL: '/auth/google/redirect',
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
    }, (accessToken, refreshToken, profile, done) => {
        //passport callback function
        this.query = knex.select('*').from('users').where('SocialLoginID', profile.id)
        this.query.then((user) => {
            //check availability 
            if (user.length === 1) {
                console.log('returning user');
                done(null, user)
            } else {
                //add user
                console.log('adding user')
                knex("users").insert(
                    {
                        userName: profile.displayName,
                        displayName: profile.displayName,
                        password: "NA",
                        email: profile.emails[0].value,
                        loginMethod: "Google",
                        SocialLoginID: profile.id,
                        profilePic: profile.photos[0].value,
                        recentSearch: "NA",
                    }
                ).then(() => {
                    this.query2 = knex.select('*').from('users').where('SocialLoginID', profile.id).then((newUser) => done(null, newUser))
                }
                ).catch((err) => console.log(err))
            }
            //end of add user
        }).catch((err) => console.log(err))
    }
        // end of passpor callback
    )
)

//facebook strategy
passport.use(
    new FacebookStrategy({
        //option for facebook strategy
        callbackURL: '/auth/facebook/redirect',
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        profileFields: ['email', 'name', 'picture.type(large)'],
    }, (accessToken, refreshToken, profile, done) => {
        //passport callback function
        this.query = knex.select('*').from('users').where('SocialLoginID', profile.id)
        this.query.then((user) => {
            //check availability 
            if (user.length === 1) {
                console.log('returning user');
                done(null, user)
            } else {
                //add user
                console.log('adding user')
                knex("users").insert(
                    {
                        userName: (profile.name.givenName + ' ' + profile.name.familyName),
                        displayName: (profile.name.givenName + ' ' + profile.name.familyName),
                        password: "NA",
                        email: profile.emails[0].value,
                        loginMethod: "Facebook",
                        SocialLoginID: profile.id,
                        profilePic: profile.photos[0].value,
                        recentSearch: "NA",
                    }
                ).then(() => {
                    this.query2 = knex.select('*').from('users').where('SocialLoginID', profile.id).then((newUser) => done(null, newUser))
                }
                ).catch((err) => console.log(err))
            }
            //end of add user
        }).catch((err) => console.log(err))
    }
        // end of passpor callback
    )
)

//Local strategy
passport.use('local', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'userName',
    passwordField: 'password',
    callbackURL: '/auth/local/redirect',
    passReqToCallback: true // allows us to pass back the entire request to the callback
}, (req, username, password, done) => {
    //passport callback function
    //login function
    console.log('local')
    if (!req.body.email) {
        console.log(req.body)
        this.query2 = knex.select('*').from('users').where('userName', req.body.userName).andWhere('password', req.body.password).then((user) => {
        console.log(user)
        if (user[0]){console.log('a');return done(null, user)} else {return done(null, false, req.flash('error_msg', 'No such user!'))}
        })
    } else {
    //register function
    this.query = knex.select('*').from('users').where('email', req.body.email).orWhere('userName', req.body.userName)
    this.query.then((rows) => {
        //check duplication 
        if (rows.length >= 1) {
            if (rows[0].userName == req.body.userName) {
                console.log('duplicate userName');
                return done(null, false, req.flash('error_msg', 'The username has been taken. Be creative!'))
            }
            else if (rows[0].email == req.body.email) {
                console.log('duplicate email');
                return done(null, false, req.flash('error_msg', 'The email has been taken. Please check again!'))
            }
        } else {
            //add user
            console.log('adding user')
            knex("users").insert(
                {
                    userName: req.body.userName,
                    displayName: req.body.displayName,
                    password: req.body.password,
                    email: req.body.email,
                    loginMethod: "Local",
                    SocialLoginID: 'NA',
                    profilePic: 'NA',
                    recentSearch: "NA",
                }
            ).then(() => {
                this.query2 = knex.select('*').from('users').where('email', req.body.email).then((newUser) => done(null, newUser))
            }
            ).catch((err) => console.log('error1' + err))
        }

        //end of add user
    }).catch((err) => console.log(err))
}
}
    // end of passpor callback
));
