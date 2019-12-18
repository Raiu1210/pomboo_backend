// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')

// modules I wrote
const user_auth = require('../my_modules/user_auth')
const about_relation = require('../my_modules/about_relation')


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
        let friend_location = []
        
        const friend_list = await about_relation(user_id, 0, posted_data)

        for(var i=0; i<friend_list.length; i++) {
            const user_id = friend_list[i]["user_id"]
            const level = friend_list[i]["level"]
            const return_time = posted_data["return_time"]

            // console.log({user_id})
            // console.log({level})
            // console.log({return_time})
            get_recent_user_location(user_id, level, return_time)
        }

        res.send({
            message: 'Your request result is here',
        })
    }
}


function get_recent_user_location(user_id, level, return_time) {
    get_user_location_sql = "SELECT * FROM user_" + user_id + "_location " + 
                            "WHERE permission <= " + level + " AND " +
                                  "timestamp > NOW() - INTERVAL " + return_time + " HOUR;" 

    console.log(get_user_location_sql)
}