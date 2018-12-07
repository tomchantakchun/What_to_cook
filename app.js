const express = require('express');
const app = express();
const hb = require('express-handlebars');
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))


const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database:   process.env.DB_NAME,
        user:       process.env.USERNAME,
        password:   process.env.PASSWORD
    }
});

app.engine('handlebars', hb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public',express.static(__dirname + '/public'));


// Start routing and rendering

const SearchRouter = require('./routers/SearchRouter')
const SearchService = require('./services/SearchService')
const searchService = new SearchService(knex);
app.use('/search', new SearchRouter(searchService).router);


// app.listen

app.listen(8080, () => {
    console.log(`Listening to port 8080...`);
})