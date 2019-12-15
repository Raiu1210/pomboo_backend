// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')

// modules I wrote
const db_config = require('./db_config')


module.exports = async function(user_id, request_code, posted_data) {
    // request_code 0 : get relation
    // request_code 1 : add relation
    // request_code 2 : remove relation
    // request_code 3 : update relation(level)
    if (request_code == 0){
        // connect db
        const conn = await mysql.createConnection(db_config);
        
        // get [user_id]'s relation from relation
        let return_obj
        const get_my_relation_sql = "SELECT user_id, level, created FROM relation where give_id = " + user_id + ";" 
        try {
            let [relation, fields] = await conn.query(get_my_relation_sql);
            conn.end()

            return relation
        } catch (err) {
            throw err;
        }

    } else if (request_code == 1) {
        const level = posted_data.level
        const give_id = posted_data.give_id

        // connect db
        const conn = await mysql.createConnection(db_config);

        // check already followed or not
        const check_sql = "SELECT count(*) FROM relation WHERE user_id = " + user_id + " AND give_id = " + give_id + ";"
        let relation_counter
        try {
            let [check_result, fields] = await conn.query(check_sql);
            relation_counter = check_result[0]["count(*)"]
        } catch (err) {
            throw err;
        }
        
        // when user has not added, insert relation
        if (relation_counter == 0) {
            const insert_sql = "INSERT INTO relation (user_id, give_id, level) VALUES (" + user_id + "," + give_id + "," + level + ");"
            try {
                let [insert_result, fields] = await conn.query(insert_sql);
                conn.end()
        
                return 0    
            } catch (err) {
                throw err;
            }
        } 

    } else if (request_code == 2) {
        const give_id = posted_data.give_id

        // connect db
        const conn = await mysql.createConnection(db_config);

        // check relation exists or not
        const check_sql = "SELECT count(*) FROM relation WHERE user_id = " + user_id + " AND give_id = " + give_id + ";"
        let relation_counter
        try {
            let [check_result, fields] = await conn.query(check_sql);
            relation_counter = check_result[0]["count(*)"]
        } catch (err) {
            throw err;
        }

        // when relation exists, remove its relation
        if (relation_counter != 0) {
            const delete_sql = "DELETE FROM relation WHERE user_id = " + user_id + " AND give_id = " + give_id + ";"
            try {
                let [delete_result, fields] = await conn.query(delete_sql);
                conn.end()

                return 0
            } catch (err) {
                throw err;
            }
        } 

    } else if (request_code == 3) {
        const level = posted_data.level
        const give_id = posted_data.give_id

        // connect db
        const conn = await mysql.createConnection(db_config);

        // check relation exists or not
        const check_sql = "SELECT count(*) FROM relation WHERE user_id = " + user_id + " AND give_id = " + give_id + ";"
        let relation_counter
        try {
            let [check_result, fields] = await conn.query(check_sql);
            relation_counter = check_result[0]["count(*)"]
        } catch (err) {
            throw err;
        }

        // when relation exists, remove its relation
        if (relation_counter != 0) {
            const delete_sql = "UPDATE relation SET level = " + level + " WHERE user_id = " + user_id + " AND give_id = " + give_id + ";"
            try {
                let [delete_result, fields] = await conn.query(delete_sql);
                
            } catch (err) {
                throw err;
            }
        } 

        conn.end()
        return
    }     


// function converToLocalTime(serverDate) {
//     var dt = new Date(Date.parse(serverDate));
//     var localDate = dt;

//     var gmt = localDate;
//         var min = gmt.getTime() / 1000 / 60; // convert gmt date to minutes
//         var localNow = new Date().getTimezoneOffset() / 60; // get the timezone
//         // offset in minutes
//         var localTime = min - localNow; // get the local time

//     var dateStr = new Date(localTime * 1000 * 60);
//     // dateStr = dateStr.toISOString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // this will return as just the server date format i.e., yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
//     dateStr = dateStr.toString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
//     return dateStr;
// }
}
