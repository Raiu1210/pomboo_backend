// var connection = require('./connect_db')

const db = require('./connect_db')

module.exports.registar_user = function(req, res) {
    res.send({
        message: 'this is registar'
    })
    console.log("this is registar")
    
    // console.log(req.body.user_name)
    // console.log(req.body.email)
    // console.log(req.body.password)
    let json = req.body

    const SQL_VAR = "email, password, user_name"
    const VALUES = "'" + json.email + "','" + json.password + "','" + json.user_name + "'"


    db.connect()
    // let insert_sql = "INSERT INTO user_list (" + SQL_VAR + ") VALUES (" + VALUES + ");" 
    let sql = "select count(*) from user_list where email = '" + json.email + "';"
    db.query(sql, (err, rows, fields) => {
        console.log(rows[0]['count(*)'])
        if (err) throw err;    
    });  
    db.end();

    console.log(sql)

    
}

console.log