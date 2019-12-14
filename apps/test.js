module.exports.test_func = function(req, res) {
    res.send({
        message: 'チンチン'
    })
}

// // register command
// curl -X POST -H "Content-Type: application/json" -d '{"email":"baio1484@gmail.com", "password":"oppai", "user_name":"raiu220"}' localhost:3000/registration

// // login command
// curl -X POST -H "Content-Type: application/json" -d '{"email":"baio1484@gmail.com", "password":"oppai"}' localhost:3000/login

// // update location command
// curl -X POST -H "Content-Type: application/json" -d '{"email":"baio1484@gmail.com", "password":"oppai", "latitude":40.587290, "longitude":140.465143, "permission":1}' localhost:3000/update_location

