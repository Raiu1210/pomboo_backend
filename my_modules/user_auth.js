// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')

// modules I wrote
const db_config = require('./db_config')


// return number means the status of auth
// 0 : auth succeed
// 1 : email address is not valid 
// 2 : email is not registered
// 3 : password is wrong
module.exports = async function(plain_email, password_hash) {
    // 1 : email address is not valid 
    if (!MailCheck(plain_email)) {
        return {status:1, id:null}
    }

    // escape email so as not to be atacked by sql injection
    const email = mysql.escape(plain_email)

    // connect db
    const conn = await mysql.createConnection(db_config);

    // search password by email
    let search_sql = "SELECT id, password_hash FROM user_list WHERE email=" + email
    try {
        let [rows, fields] = await conn.query(search_sql);
        if (Object.keys(rows).length == 0) {
            // 2 : email is not registered
            return {status:2, id:null}
        } else {
            //　email registered
            if (password_hash == rows[0]["password_hash"]) {
                // 0 : auth succeed
                const authed_id = rows[0]["id"]
                return {status:0, id:authed_id}
            } else {
                // 3 : password is wrong
                return {status:3, id:null}
            }
        }
    } catch (err) {
        throw err;
    } finally {
        conn.end()
    }
}


function MailCheck(mail) {
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