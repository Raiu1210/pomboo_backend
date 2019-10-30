const mysql = require('mysql')

var dbConfig = {
    host : 'localhost',
    user : 'raiu',
    password : 'raiu114514',
    database: 'mona_marche',
    timezone: 'jst'
};

var connection = mysql.createConnection(dbConfig);

module.exports = connection;