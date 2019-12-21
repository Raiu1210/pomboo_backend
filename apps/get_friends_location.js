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

            const friend_location = await get_recent_user_location(user_id, level)
            // const return_obj = friend_location["contents"]
            if (friend_location["data_exist"]) {
                friend_locations.push(friend_location["contents"])
            }
        }
        
        res.send({
            message: 'Your request result is here',
            friend_locations: friend_locations
        })
    }
}


async function get_recent_user_location(user_id, level) {
    let data_exist = false
    let contents = {}

    const get_user_location_sql = "SELECT * FROM user_" + user_id + "_location " + 
                                  "WHERE permission <= " + level + 
                                  " ORDER BY timestamp DESC LIMIT 1;"


    // connect db
    const conn = await mysql.createConnection(db_config);
    try {
        let [friend_data, fields] = await conn.query(get_user_location_sql);
        if (friend_data.length != 0) {
            data_exist = true
            contents = {
                "user_id" : user_id,
                "permission" : friend_data[0]["permission"],
                "latitude" : friend_data[0]["latitude"],
                "longitude" : friend_data[0]["longitude"],
                "timestamp" : friend_data[0]["timestamp"]
            }
        }  

        return {"data_exist": data_exist, "contents": contents}
    } catch (err) {
        throw err;
    } finally {
        conn.end()
    }
}
