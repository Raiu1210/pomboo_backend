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
        const request_code = posted_data.request_code
        
        const result = await about_relation(user_id, request_code, posted_data)

        res.send({
            message: 'Your request result is here',
            status: 0,
            result: result
        })
    }
}
