const express = require('express');
const app = express();
const hb = require('express-handlebars');
require('dotenv').config();
const bodyParser = require('body-parser');
const https = require('https');
const passport = require('passport');
require('./services/passport-service');
const fs = require('fs');
const cookieSession = require('cookie-session');
const authRoutes = require('./routers/auth-routers');
const profileRoutes = require('./routers/profile-routers');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database:   process.env.DB_NAME,
        user:       process.env.USERNAME,
        password:   process.env.PASSWORD
    }
});

//initilize 
app.use(passport.initialize());
app.use(passport.session());

//cookie session
app.use(cookieSession({
    maxAge: 7*24*60*60*1000, //7days
    keys: [process.env.COOKIE_KEY]
}))

//handlebard and view rendering
app.engine('handlebars', hb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public',express.static(__dirname + '/public'));


// Start routing and rendering

const SearchRouter = require('./routers/SearchRouter')
const SearchService = require('./services/SearchService')
const searchService = new SearchService(knex);
app.use('/search', new SearchRouter(searchService).router);

// user authentication routers


app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

//create home

app.use('/',(req,res)=>{
    res.render('index')
})

// app.listen

app.listen(8080, () => {
    console.log(`Listening to port 8080...`);
})

//https

const options = {
    cert: fs.readFileSync('./localhost.crt'),
    key: fs.readFileSync('./localhost.key')
}

https.createServer(options, app).listen(3000)