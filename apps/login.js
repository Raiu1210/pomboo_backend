// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')

// modules I wrote
const db_config = require('./db_config')


module.exports = async function(req, res) { 
    // initialize variables with posted data
    // and escape them so as not to be attacked by sql injection
    let posted_data = req.body
    let email = mysql.escape(posted_data.email)
    let password = mysql.escape(posted_data.password)

    // if json.email is not email address
    if (!MailCheck(posted_data.email)) {
        res.send({
            message: 'this email address is not valid'
        })
        return false
    }

    // connect db
    const conn = await mysql.createConnection(db_config);

    // search password by email
    let search_sql = "SELECT password_hash FROM user_list WHERE email=" + email
    try {
        let [rows, fields] = await conn.query(search_sql);
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
                res.send({
                    message: "login success",
                    status: 1
                })
            } else {
                // login failed
                console.log("login failed")
                res.send({
                    message: "login failed",
                    status: 0
                })
            }
        }
    } catch (err) {
        throw err;
    }


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