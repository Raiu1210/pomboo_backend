const mysql = require('mysql')
const crypto = require('crypto')

const db = require('./connect_db')

module.exports.registar_user = function(req, res) {
    let json = req.body
    let email = mysql.escape(json.email)
    let password = mysql.escape(json.password)
    let password_hash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
    let user_name = mysql.escape(json.user_name)

    const SQL_VAR = "email, password_hash, user_name"
    const VALUES = email + ",'" + password_hash + "'," + user_name

    db.connect()
    // check user is already exists or not
    let check_sql = "select count(*) from user_list where email = " + email + ";"
    db.query(check_sql, (err, rows, fields) => {
        if (err) throw err;
        if (rows[0]["count(*)"] == 0) {
            // not existed
            let insert_sql = "INSERT INTO user_list (" + SQL_VAR + ") VALUES (" + VALUES + ");" 
            db.query(insert_sql, (err, rows, fields) => {
                if (err) throw err;
                res.send({
                    message: 'registered'
                })
            })
        } else {
            // existed
            res.send({
                message: 'this email address is already registered'
            })
        }
        db.end()
    })
}