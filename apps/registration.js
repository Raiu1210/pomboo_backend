// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')

// modules I wrote
const db_config = require('./db_config')


module.exports.registar_user = async function(req, res) {
    const json = req.body
    const email = mysql.escape(json.email)
    const password = mysql.escape(json.password)
    const password_hash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
    const user_name = mysql.escape(json.user_name)

    const SQL_VAR = "email, password_hash, user_name"
    const VALUES = email + ",'" + password_hash + "'," + user_name

    // if json.email is not email address
    if (!MailCheck(json.email)) {
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
        //             -> (2) create table [email-hash].sha256.hex_location table

        // (1) insert user info into user_list table
        let insert_sql = "INSERT INTO user_list (" + SQL_VAR + ") VALUES (" + VALUES + ");" 
        try {
            let [rows_2, fields_2] = await conn.query(insert_sql);
            res.send({
                message: 'registered'
            })
        } catch {
            throw err;
        }
            
            
        // (2) create table [email-hash].sha256.hex_location table
        let user_id
        let id_check_sql = "select id from user_list where email=" + email
        try {
            let [rows_3, fields_3] = await conn.query(id_check_sql);
            user_id = rows_3[0]["id"]
        } catch {
            throw err;
        }

        console.log("id = " + user_id)

            // db.query(id_check_sql, (err, rows3, fields) => {
            //     let table_name = "user" 
            //     let uesr_table_sql = "CREATE TABLE " + table_name + " IF NOT EXISTS (" +
            //         "`permission` TYNYINT NOT NULL," +
            //         "latitude double," +
            //         "longitude double," +
            //         "timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
            //         ") ENGINE=InnoDB  DEFAULT CHARSET=utf8;"

            //     console.log(rows3)
            //     // db.query(uesr_table_sql, (err, rows, fields) => {

            //     // })
            // })
            
    } else {
        // existed
        res.send({
            message: 'this email address is already registered'
        })
    }

    

    // db.query(check_sql, (err, rows1, fields) => {
    //     if (err) throw err;
    //     if (rows1[0]["count(*)"] == 0) {
    //         // not existed
    //         // insert user info into table
    //         let insert_sql = "INSERT INTO user_list (" + SQL_VAR + ") VALUES (" + VALUES + ");" 
    //         db.query(insert_sql, (err, rows2, fields) => {
    //             if (err) throw err;
    //             res.send({
    //                 message: 'registered'
    //             })

    //             // create user info table
    //             // let id_check_sql = "select id from user_list where email=" + email
    //             // db.query(id_check_sql, (err, rows3, fields) => {
    //             //     let table_name = "user" 
    //             //     let uesr_table_sql = "CREATE TABLE " + table_name + " IF NOT EXISTS (" +
    //             //         "`permission` TYNYINT NOT NULL," +
    //             //         "latitude double," +
    //             //         "longitude double," +
    //             //         "timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
    //             //         ") ENGINE=InnoDB  DEFAULT CHARSET=utf8;"

    //             //     console.log(rows3)
    //             //     // db.query(uesr_table_sql, (err, rows, fields) => {

    //             //     // })
    //             // })
                
    //         })
    //     } else {
    //         // existed
    //         res.send({
    //             message: 'this email address is already registered'
    //         })
    //     }
    // })

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