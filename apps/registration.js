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

    // if json.email is not email address
    if (!MailCheck(json.email)) {
        res.send({
            message: 'this email address is not valid'
        })
        return
    }

    db.connect()
    // check user is already exists or not
    let check_sql = "select count(*) from user_list where email = " + email + ";"
    db.query(check_sql, (err, rows1, fields) => {
        if (err) throw err;
        if (rows1[0]["count(*)"] == 0) {
            // not existed
            // insert user info into table
            let insert_sql = "INSERT INTO user_list (" + SQL_VAR + ") VALUES (" + VALUES + ");" 
            db.query(insert_sql, (err, rows2, fields) => {
                if (err) throw err;
                res.send({
                    message: 'registered'
                })

                // create user info table
                let id_check_sql = "select id from user_list where email=" + email
                db.query(id_check_sql, (err, rows3, fields) => {
                    let table_name = "user" 
                    let uesr_table_sql = "CREATE TABLE " + table_name + " IF NOT EXISTS (" +
                        "`permission` TYNYINT NOT NULL," +
                        "latitude double," +
                        "longitude double," +
                        "timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                        ") ENGINE=InnoDB  DEFAULT CHARSET=utf8;"

                    console.log(rows3)
                    // db.query(uesr_table_sql, (err, rows, fields) => {

                    // })
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


function MailCheck( mail ) {
    var mail_regex1 = new RegExp( '(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*' );
    var mail_regex2 = new RegExp( '^[^\@]+\@[^\@]+$' );
    if( mail.match( mail_regex1 ) && mail.match( mail_regex2 ) ) {
        // 全角チェック
        if( mail.match( /[^a-zA-Z0-9\!\"\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/ ) ) { return false; }
        // 末尾TLDチェック（〜.co,jpなどの末尾ミスチェック用）
        if( !mail.match( /\.[a-z]+$/ ) ) { return false; }
        return true;
    } else {
        return false;
    }
}