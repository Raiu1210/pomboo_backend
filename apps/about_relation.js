// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')

// modules I wrote
const user_auth = require('../my_modules/user_auth')
const db_config = require('../my_modules/db_config')


module.exports = async function(req, res) {
    // initialize variables with posted data
    // and escape them so as not to be attacked by sql injection
    let posted_data = req.body
    let email = posted_data.email
    let password_hash = crypto.createHash('sha256').update(mysql.escape(posted_data.password), 'utf8').digest('hex');


    const auth_result = await user_auth(email, password_hash)
    // return number means the status of auth
    // 0 : auth succeed
    // 1 : email address is not valid 
    // 2 : email is not registered
    // 3 : password is wrong
    if (auth_result["status"] == 0) {
        const user_id = auth_result.id
        const request_code = posted_data.request_code

        // check request_code
        // code 0 : get relation
        // code 1 : add relation
        // code 2 : remove relation
        if (request_code == 0){
            // connect db
            const conn = await mysql.createConnection(db_config);

            // (1) get [user_id]'s relation from relation
            const get_my_relation_sql = "SELECT follow_id, level, created FROM relation where user_id = " + user_id + ";" 
            try {
                let [relation, fields] = await conn.query(get_my_relation_sql);
                
                res.send({
                    message: 'Your relationships are here',
                    status: 0,
                    relation: relation
                })
            } catch (err) {
                throw err;
            }

            conn.end()
            return
        } else if (request_code == 1) {
            const level = posted_data.level
            const follow_id = posted_data.follow_id
        }
    
        
    } else {
        console.log("this user doesn't uthed")
        res.send({
            message: 'you are not valid for now',
            status: -1,
            relation: [{"follow_id":-1,"level":-1,"created":"2019-12-11T06:38:40.000Z"}]
        })
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
