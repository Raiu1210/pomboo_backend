const mysql = require('mysql2/promise')
const crypto = require('crypto')

const db = require('./db_config')

module.exports.login = function(req, res) { 
    let json = req.body
    let email = mysql.escape(json.email)
    let password = mysql.escape(json.password)

    let find_email_sql = "SELECT password_hash FROM user_list WHERE email=" + email
    db.query(find_email_sql, (err, rows, fields) => {
        if (err) throw err
        if (Object.keys(rows).length == 0) {
            // email is not registered
            res.send({
                message: email + " is not registered"
            })
        } else {
            //　email registered
            let password_hash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
            if (password_hash == rows[0]["password_hash"]) {
                // login succeeded
                console.log("login success!")
            } else {
                // login failed
                console.log("login failed")
            }
        }
    })

    console.log(email)
    console.log(password)

    res.send({
        message: 'hey'
    })
}