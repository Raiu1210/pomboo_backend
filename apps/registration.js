// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')

// modules I wrote
const db_config = require('./db_config')


module.exports.registar_user = async function(req, res) {
    // initialize variables with posted data
    // and escape them so as not to be attacked by sql injection
    const posted_data = req.body
    const email = mysql.escape(posted_data.email)
    const password = mysql.escape(posted_data.password)
    const password_hash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
    const user_name = mysql.escape(posted_data.user_name)


    // if json.email is not email address
    if (!MailCheck(posted_data.email)) {
        res.send({
            message: 'this email address is not valid'
        })
        return
    }

    // connect db
    const conn = await mysql.createConnection(db_config);

    // check user is already exists or not
    let count_of_input_email
    const check_sql = "select count(*) from user_list where email = " + email + ";"
    try {
        let [rows_1, fields_1] = await conn.query(check_sql);
        count_of_input_email = rows_1[0]["count(*)"]
    } catch (err) {
        throw err;
    }

    // proceed with counted info
    if (count_of_input_email == 0) {
        // not existed -> (1) insert user info into user_list table
        //             -> (2) create table user_[user_id]_location table
        
        // (1) insert user info into user_list table
        const SQL_VAR = "email, password_hash, user_name"
        const VALUES = email + ",'" + password_hash + "'," + user_name
        const insert_sql = "INSERT INTO user_list (" + SQL_VAR + ") VALUES (" + VALUES + ");" 
        try {
            let [rows_2, fields_2] = await conn.query(insert_sql);
        } catch (err) {
            throw err;
        }
             
        // (2) create table [email-hash].sha256.hex_location table
        // get user_id from user_list table
        let user_id
        const id_check_sql = "select id from user_list where email=" + email
        try {
            let [rows_3, fields_3] = await conn.query(id_check_sql);
            user_id = rows_3[0]["id"]
        } catch (err) {
            throw err;
        }

        // create user_[user_id]_location table
        const table_name = "user_" + user_id + "_location ("
        let create_uesr_location_table_sql = "CREATE TABLE " + table_name +
                "`permission` TINYINT," +
                "`latitude` DOUBLE," +
                "`longitude` DOUBLE," +
                "`timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                ") ENGINE=InnoDB  DEFAULT CHARSET=utf8;"
        try {
            let [rows_4, fields_4] = await conn.query(create_uesr_location_table_sql);
            res.send({
                message: 'register succeeded'
            })
        } catch (err) {
            throw err;
        }
    } else {
        // existed
        res.send({
            message: 'this email address is already registered'
        })
    }

    conn.end();
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