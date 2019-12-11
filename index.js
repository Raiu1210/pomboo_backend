// This is npm modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
// const https = require('https')
// const fs = require('fs');


// This is modules what I made
const test = require('./apps/test')
const registration = require('./apps/registration')
const login = require('./apps/login')
const update_location = require('./apps/update_location')
const about_relation = require('./apps/about_relation')

// var options = {
//     key:  fs.readFileSync('../../../ssl/localhost.key'),
//     cert: fs.readFileSync('../../../ssl/localhost.crt')
// };

const app = express()
app.use(bodyParser.json())
app.use(cors())

// var server = https.createServer(options,app);
var server = http.createServer(app);


app.get('/', test.test_func)
app.post('/registration', registration)
app.post('/login', login)
app.post('/update_location', update_location)
app.post('/about_relation', about_relation)


server.listen(process.env.PORT || 3000)
