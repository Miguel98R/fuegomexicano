require('dotenv').config()

const express = require ('express')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')

const RedisStore = require("connect-redis").default
const session = require('express-session');
const {createClient} = require('redis');

const db = require('./db')
const app = express()

//configuraciones 

app.set('port', process.env.PORT || 3080)
app.set('appName',process.env.APP_NAME || 'fuegomexicano')

app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'pug')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

app.use(morgan('dev'))

app.use('/public', express.static(path.join(__dirname, 'public')))


app.get(/robots\.txt$/, function (req, res) {
    const urlHost = req.protocol + '://' + req.get('host');
    res.type('text/plain');
    res.send(`
        User-agent: *
        Disallow: /cpanel/
        Disallow: /login_catas/
        Sitemap: ${urlHost}/sitemap.xml
    `);
});


// Initialize client.
let redisClient = createClient({
    port: 3080,
})
redisClient.connect().catch(console.error)

// Initialize sesssion storage.
app.use(
    session({
        store: new RedisStore({
            client: redisClient,
        }),
        secret: process.env.EXPRESS_SESSION_SECRET,
        name: process.env.NAME_COOKIE_SESSION,
        resave: true,
        saveUninitialized: true,
        cookie: {maxAge: 1 * 24 * 60 * 60 * 1000},
        httpOnly: true
    })
)



//rutas
app.use(require('./viewEngine/routes'))
app.use('/api', require('./routes/_api'))

//Inicializando el servidor
app.listen(app.get('port'), () => {
    console.log(app.get('appName'))
    console.log("Server port:", app.get('port'))

})
