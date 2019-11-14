const db = require('./connect_db')

module.exports.registar_user = function(req, res) {
    let json = req.body
    const SQL_VAR = "email, password, user_name"
    const VALUES = "'" + json.email + "','" + json.password + "','" + json.user_name + "'"

    db.connect()
    // check user is already exists or not
    let sql = "select count(*) from user_list where email = '" + json.email + "';"
    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
        if (rows[0]["count(*)"] == 0) {
            // not existed
            let insert_sql = "INSERT INTO user_list (" + SQL_VAR + ") VALUES (" + VALUES + ");" 
            db.query(insert_sql, (err, rows, fields) => {
                if (err) throw err;
                res.send({
                    message: 'registered'
                })
                console.log(rows)
            })
            db.end()
        } else {
            // existed
            res.send({
                message: 'this email address is already registered'
            })
            db.end()
        }
    });    
}