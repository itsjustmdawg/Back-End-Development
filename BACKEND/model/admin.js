var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');

var admin = {
    login: function (email, password, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }

            else {
                console.log(`Connected! Login with email: ${email}, password: ${password}`);

                var sql = 'SELECT * FROM staff WHERE email = ? and password = ?';   

                conn.query(sql, [email, password], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    else {
                        var token = "";

                        if (result.length == 1) {
                            token = jwt.sign({ id: result[0].staff_id, email: result[0].email }, config.key, {
                                expiresIn: 86400 //expires in 24 hrs
                            });

                            console.log("@@token " + token);
                            return callback(null, token, result);
                        }

                        else {
                            var err2 = new Error("Email/Password does not match.");
                            err2.statusCode = 500;
                            return callback(err2, null, null);
                        }
                    }
                });
            }
        });
    },

    addNewActor: function (first_name, last_name, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }

            else {
                console.log(`Add new actor ${first_name} ${last_name}`);

                var sql = 'INSERT INTO actor (first_name, last_name) VALUES (?,?)';

                conn.query(sql, [first_name, last_name], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                });
            }
        });
    },

    addNewCustomer: function (address_line1, address_line2, district, city_id, postal_code, phone, store_id, first_name, last_name, email, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }

            else {
                var sqlAddCustomerAddress = 'INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES (?, ?, ?, ?, ?, ?)';
                var sqlAddCustomerInfo = 'INSERT INTO customer (store_id, first_name, last_name, email, address_id) VALUES (?, ?, ?, ?, (SELECT MAX(address_id) FROM address))';

                if (address_line1 != null && address_line2 != null && district != null && city_id != null && postal_code != null && phone != null && store_id != null && first_name != null && last_name != null && email != null) {
                    conn.query(sqlAddCustomerAddress, [address_line1, address_line2, district, city_id, postal_code, phone], function (err) {
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }
                    });

                    conn.query(sqlAddCustomerInfo, [store_id, first_name, last_name, email], function (err, result) {
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }

                        else {
                            console.log(result);
                            return callback(null, result);
                        }
                    });
                }

                else {
                    console.log('Please provide all fields.');
                    return callback(null, null);
                }
            }
        });
    },
    // get store id for dropdown
    getStoreID: function(callback){
        var conn = db.getConnection();
        conn.connect(function(err){
            if(err){
                console.log(err);
                return callback(err, null);
            }else{
                var sql = "SELECT store_id FROM store;"
                conn.query(sql, function(err, result){
                    if(err){
                        console.log(err)
                        return callback(err, null);
                    }else{
                        return callback(null, result);
                    }
                })
            }
        })
    }
}

module.exports = admin;