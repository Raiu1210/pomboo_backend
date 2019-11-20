// npm modules
const mysql = require('mysql2/promise')
const crypto = require('crypto')

// modules I wrote
const user_auth = require('../my_modules/user_auth')


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
    if (auth_result == 0) {
        res.send({
            message: 'auth success',
            auth_result: auth_result
        })
    } else if (auth_result == 1) {
        res.send({
            message: 'email address is not valid',
            auth_result: auth_result
        })
    } else if (auth_result == 2) {
        res.send({
            message: 'email is not registered',
            auth_result: auth_result
        })
    } else if (auth_result == 3) {
        res.send({
            message: 'password is wrong',
            auth_result: auth_result
        })
    }
}
