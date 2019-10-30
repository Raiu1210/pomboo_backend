const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')
const fs = require('fs');

var options = {
    key:  fs.readFileSync('../../../ssl/localhost.key'),
    cert: fs.readFileSync('../../../ssl/localhost.crt')
};

const app = express()
app.use(bodyParser.json())
app.use(cors())

var server = https.createServer(options,app);


app.get('/', function(req, res) {
  res.send({
    message: 'Hello world!'
  })
})

server.listen(process.env.PORT || 3000)
