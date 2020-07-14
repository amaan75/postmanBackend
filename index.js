const express = require('express')
const bodyparser = require('body-parser')
const app = express()

app.use(bodyparser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization,x-auth-token');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,DELETE,PATCH,POST,GET');
        return res.status(200).json({});
    }
    next();
});
//CONNECTING TO DATABASE
require('./utils/database/database')
require('./config')

//IMPORT ROUTERS
let UserRouter = require('./routes/UserRouter')
let UserAuthRouter = require('./routes/UserAuthRoute')
let WeatherRouter = require('./weather/WeatherRoute')
let ClassRouter = require('./routes/ClassRouter')
let BooksRouter = require('./routes/BooksRouter')
let CollegeROuter = require('./routes/CollegeRouter')
let RequestRouter = require('./routes/RequestsRouter')


//USING OUR ROUTES
app.use('/user', UserRouter)
app.use('/class', ClassRouter)
app.use('/userAuth', UserAuthRouter)
app.use('/weather', WeatherRouter)
app.use('/class', ClassRouter)
app.use('/books', BooksRouter)
app.use('/colleges', CollegeROuter)
app.use('/requests', RequestRouter)



module.exports = app
