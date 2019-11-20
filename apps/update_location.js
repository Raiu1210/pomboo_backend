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
        const latitude = posted_data.latitude
        const longitude = posted_data.longitude
        const permission = posted_data.permission

        // check geo data
        if (absolute(latitude) > 90 || absolute(longitude) > 180){
            res.send({
                message: 'geo data is not valid',
            })

            return 
        }
        // check permission
        if (permission < 0 || permission > 2) {
            res.send({
                message: 'permission is not valid',
            })

            return
        }

        // connect db
        const conn = await mysql.createConnection(db_config);

        const SQL_VAR = "permission, latitude, longitude"
        const VALUES = permission + "," + latitude + "," + longitude
        const insert_loc_sql = "INSERT INTO user_" + auth_result["id"] + "_location" +
                        " ( " + SQL_VAR + " ) VALUES (" + VALUES + " );"
        try {
            let [rows, fields] = await conn.query(insert_loc_sql);
            res.send({
                message: 'geo data is updated',
            })
        } catch (err) {
            throw err;
        } finally {
            conn.end()
        }
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


function absolute(number) {
    if (number < 0) {
        return -number
    } else {
        return number
    }
}