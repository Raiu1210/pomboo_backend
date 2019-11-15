const mysql = require('mysql')
const db = require('./connect_db')

module.exports.login = function(req, res) { 
    let json = req.body
    let user_name = mysql.escape(json.email)
    let password = mysql.escape(json.password)

    let auth_sql = ""

    console.log(user_name)
    console.log(password)
}