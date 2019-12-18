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

// // update relation
// // (0) show my relation
// curl -X POST -H "Content-Type: application/json" -d '{"email":"baio1484@gmail.com", "password":"oppai", "request_code":0}' localhost:3000/relation

// // (1) add relation
// curl -X POST -H "Content-Type: application/json" -d '{"email":"test4@gmail.com", "password":"oppai", "request_code":1, "level":1, "give_id":1}' localhost:3000/relation

// // (2) remove relation
// curl -X POST -H "Content-Type: application/json" -d '{"email":"baio1484@gmail.com", "password":"oppai", "request_code":2, "give_id":1}' localhost:3000/relation

// // (3) change level of relation
// curl -X POST -H "Content-Type: application/json" -d '{"email":"baio1484@gmail.com", "password":"oppai", "request_code":3, "level":3, "give_id":1}' localhost:3000/relation

// // get friend's location
// curl -X POST -H "Content-Type: application/json" -d '{"email":"baio1484@gmail.com", "password":"oppai"}' localhost:3000/get_frined_location