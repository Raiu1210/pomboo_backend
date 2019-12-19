// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')

// modules I wrote
const user_auth = require('../my_modules/user_auth')
const about_relation = require('../my_modules/about_relation')
const db_config = require('../my_modules/db_config')

module.exports = async function(req, res) { 
    // initialize variables with posted data
    // and escape them so as not to be attacked by sql injection
    const posted_data = req.body
    const email = posted_data.email
    const password_hash = crypto.createHash('sha256').update(mysql.escape(posted_data.password), 'utf8').digest('hex');
    
    const auth_result = await user_auth(email, password_hash)
    // return number means the status of auth
    // 0 : auth succeed
    if (auth_result["status"] == 0) {
        const user_id = auth_result.id
        let friend_locations = []
        
        const friend_list = await about_relation(user_id, 0, posted_data)

        for(var i=0; i<friend_list.length; i++) {
            const user_id = friend_list[i]["user_id"]
            const level = friend_list[i]["level"]
            const return_hour = posted_data["return_hour"]

            // console.log({user_id})
            // console.log({level})
            // console.log({return_time})
            get_recent_user_location(user_id, level, return_hour)
        }

        res.send({
            message: 'Your request result is here',
        })
    }
}


async function get_recent_user_location(user_id, level, return_hour) {
    const get_user_location_sql = "SELECT * FROM user_" + user_id + "_location " + 
                                  "WHERE permission <= " + level + " AND " +
                                  "timestamp > NOW() - INTERVAL " + return_hour + " HOUR;" 



    console.log(get_user_location_sql)
    // connect db
    const conn = await mysql.createConnection(db_config);
    try {
        let [friend_location, fields] = await conn.query(get_user_location_sql);
        console.log(friend_location)
    } catch (err) {
        throw err;
    } 
}