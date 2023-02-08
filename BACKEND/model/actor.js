// Admission Number: 2234865
// Author: Mahesha Uthayakumar
// Class: DIT/FT/1B/03
// File: actor.js

var db = require('./databaseConfig.js');

var actorDB = {
    // method for endpoint 1
    getActorByID: function (actor_id, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                var sql = 'SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?;';
                conn.query(sql, [actor_id], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },
    // method for endpoint 2
    orderOfActor: function (limit, offset, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                var sql = "SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT " + limit + " OFFSET " + offset + ";";
                conn.query(sql, [limit, offset], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },
    // method for endpoint 3
    addNewActor: function (first_name, last_name, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                var sql = "INSERT INTO actor(first_name, last_name) VALUES (?, ?);";
                if (first_name == null || last_name == null) {
                    return callback(err, null);
                }
                conn.query(sql, [first_name, last_name], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },
    // method for endpoint 4
    updateActorName: function (actor_id, object, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err || (object[0] == null && object[1] == null)) {
                return callback(err, null);
            } else {
                var sql1 = "UPDATE actor SET first_name=? WHERE actor_id=?;";
                var sql2 = "UPDATE actor SET last_name=? WHERE actor_id=?;";
                var sql3 = "UPDATE actor SET first_name=?, last_name=? WHERE actor_id=?;";
                if (object[0] != null && object[1] == null) {
                    conn.query(sql1, [object[0], actor_id], function (err, result) {
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            console.log(result);
                            return callback(null, result);
                        }
                    })
                } else if (object[0] == null && object[1] != null) {
                    conn.query(sql2, [object[1], actor_id], function (err, result) {
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            console.log(result);
                            return callback(null, result);
                        }
                    })
                } else if (object[0] != null && object[1] != null) {
                    conn.query(sql3, [object[0], object[1], actor_id], function (err, result) {
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            console.log(result);
                            return callback(null, result);
                        }
                    })
                }
            }
        })
    },
    // method for endpoint 5
    deleteActor: function (actor_id, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = "DELETE FROM film_actor WHERE film_actor.actor_id=?; DELETE FROM actor WHERE actor.actor_id=?;"; // delete in film_actor then delete in actor then realign actor_id in both places
                conn.query(sql, [actor_id, actor_id], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                })
            }
        })
    },
    // category.name AS category, film.length AS duration
    // method for endpoint 6
    getFilm: function (category_id, max, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else { 
                if(max == ""){
                    max = 9.99;
                }
                var sql = "SELECT film.film_id, film.title,  film.rating, film.release_year FROM film, film_category WHERE film_category.category_id=? AND film.film_id = film_category.film_id AND film.rental_rate <= ?;";
                conn.query(sql, [category_id, max], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // dynamic dropdown for film category
    getFilmCategory: function(callback){
        var conn = db.getConnection();
        conn.connect(function(err){
            if(err){
                console.log(err);
                return callback(err, null);
            }else{
                var sql = "SELECT name FROM category;"
                conn.query(sql, function(err, result){
                    if(err){
                        console.log(err);
                        return callback(err, null);
                    }else{
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // method for endpoint 7
    getCustPayment: function (customer_id, start_date, end_date, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = "SELECT title, amount, payment_date FROM payment, rental, inventory, film WHERE payment_date >= ? AND payment_date <= ? AND payment.customer_id=? AND payment.rental_id=rental.rental_id AND rental.inventory_id=inventory.inventory_id AND inventory.film_id=film.film_id;";
                conn.query(sql, [start_date, end_date, customer_id], function (err, result) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        })
    },
    // method for endpoint 8
    addNewCustomer: function (address_line1, address_line2, district, city_id, postal_code, phone, store_id, first_name, last_name, email, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err || address_line1 == null || address_line2 == null || district == null || city_id == null || postal_code == null || phone == null || store_id == null || first_name == null || last_name == null) {
                return callback(err, null);
            } else {
                var sql = "INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES (?, ?, ?, ?, ?, ?);";
                var sql2 = "INSERT INTO customer (store_id, first_name, last_name, email, address_id) VALUES (?, ?, ?, ?, (SELECT max(address_id) FROM address));";
                var duplicateCheck = "SELECT * FROM customer WHERE email=?;";
                conn.query(duplicateCheck, [email], function (err, check) {
                    if (err) {
                        return callback(err, null);
                    } else if (check == '') {
                        conn.query(sql, [address_line1, address_line2, district, city_id, postal_code, phone], function (err) {
                            if (err) {
                                return callback(err, null);
                            }
                        });
                        conn.query(sql2, [store_id, first_name, last_name, email], function (err, result) {
                            if (err) {
                                return callback(err, null);
                            } else {
                                return callback(null, result);
                            }
                        });
                    } else if (check != '') {
                        return callback(null, null);
                    }
                })
            }
        })
    },
    // method to search for film with title
    searchForDVD: function(search, max, callback){
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                // reset to satisfy like operator
                search = `${search}%`; 
                // checks the maximum val
                if (max == '') {
                    max = 9.99;
                }
                max = parseFloat(max);
                var sql = 'SELECT film_id, title, release_year, rating FROM film WHERE title LIKE ? AND rental_rate <= ?;';
                conn.query(sql, [search, max], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },
    // method to view film in detail
    detailDVD: function(film_id, callback){
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }

            else {
                console.log(`Access film details: #${film_id}`);

                var sql = 'SELECT film_list.*, film.release_year FROM film_list, film WHERE FID = ? AND FID = film.film_id;';
                
                conn.query(sql, [film_id], function (err, result) {
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
    }
}




module.exports = actorDB;