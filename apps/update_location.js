// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')
const rp = require('request-promise');

// modules I wrote
const db_config = require('./db_config')

var headers = {
    'Accept': 'application/json',
    'Content-type': 'application/json'
};

var dataString = '{"user_name":"raiu220","email":"baio1484@gmail.com", "password":"oppai", "latitude":40.58787060277108, "longitude":140.47386416071663}';

var options = {
    url: 'http://localhost:3000/login',
    method: 'POST',
    headers: headers,
    body: dataString
};


module.exports = async function(req, res) {
    console.log("this is update location")
    res.send({
        message: "this is update location"
    })

    try {
        let result = await rp(options)
        console.log(result)
    } catch (err) {
        throw err
    }
}