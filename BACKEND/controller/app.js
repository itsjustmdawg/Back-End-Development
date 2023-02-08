// Admission Number: 2234865
// Author: Mahesha Uthayakumar
// Class: DIT/FT/1B/03
// File: app.js

var express = require('express');
var app = express();
var actor = require('../model/actor.js');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var verifyToken = require('../auth/verifyToken.js');
var admin = require('../model/admin');
app.use(bodyParser.json());
var cors = require('cors');
app.options('*', cors());
app.use(cors());
app.use(urlencodedParser);

// Endpoint 1
app.get("/actors/:actor_id", (req, res) => {
    var actor_id = req.params.actor_id;
    actor.getActorByID(actor_id, function (err, result) {
        if (err) {
            res.status(500).send({ "error_message": "Internal server error" });
        } else if (result.length == 0) {
            res.status(204).send();
        } else {
            res.status(200).send(result);
        }
    });
});

// Endpoint 2
app.get("/actors", function (req, res) {
    var limit = req.query.limit || 20;
    var offset = req.query.offset || 0;
    actor.orderOfActor(limit, offset, function (err, result) {
        if (err) {
            res.status(500).send({ "error_message": "Internal server error" });
        } else if (result.length == 0) {
            res.status(200).send([]);
        } else {
            res.status(200).send(result);
        }
    });
});


// Endpoint 3
app.post("/actors", function (req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    actor.addNewActor(first_name, last_name, function (err, result) {
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        } else if (first_name == null || last_name == null) {
            res.status(400).send({ "error_msg": "missing data" });
        } else {
            var insertId = { actor_id: result.insertId };
            res.status(201).send(insertId);
        }
    });
});

// Endpoint 4
app.put("/actors/:actor_id", function (req, res) {
    var actor_id = req.params.actor_id;
    var object = [req.body.first_name, req.body.last_name];
    actor.updateActorName(actor_id, object, function (err, result) {
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        } else if (object[0] == null && object[1] == null) {
            res.status(400).send({ "error_msg": "missing data" })
        } else if (result.affectedRows == 0) {
            res.status(204).send();
        } else {
            res.status(200).send({ "success_msg": "record updated" });
        }
    });
});

// Endpoint 5
app.delete("/actors/:actor_id", function (req, res) {
    var actor_id = req.params.actor_id;
    actor.deleteActor(actor_id, function (err, result) {
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" })
        } else if (result[0].affectedRows == 0 && result[1].affectedRows == 0) {
            res.status(204).send();
        } else {
            console.log(result);
            res.status(200).send({ "success_msg": "actor deleted" })
        }
    });
});

// Endpoint 6
app.get("/film_categories/:category_id/films", function (req, res) {
    var category_id = req.params.category_id;
    actor.getFilm(category_id, function (err, result) {
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        } else if (result.length == 0) {
            res.status(200).send([]);
        } else {
            res.status(200).send(result);
        }
    });
});

// Endpoint 7
app.get("/customer/:customer_id/payment", function (req, res) {
    var customer_id = req.params.customer_id;
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    actor.getCustPayment(customer_id, start_date, end_date, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ "error_msg": "Internal server error" });
        } else {
            var total = 0;
            for (var i = 0; i < result.length; i++) {
                total += result[i].amount;
            }
            res.status(200).send({ "rental": result, "total": total.toFixed(2) });
        }
    })
})

// Endpoint 8
app.post("/customers", function (req, res) {
    var store_id = req.body.store_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var address = req.body.address;
    actor.addNewCustomer(address.address_line1, address.address_line2, address.district, address.city_id, address.postal_code, address.phone, store_id, first_name, last_name, email, function (err, result) {
        if (err) {
            if (address.address_line1 == null || address.address_line2 == null || address.district == null || address.city_id == null || address.postal_code == null || address.phone == null || store_id == null || first_name == null || last_name == null || email == null) {
                res.status(400).send({ "error_msg": "missing data" });
            } else {
                console.log(err);
                res.status(500).send({ "error_msg": "Internal server error" });
            }
        } else if (result == null) {
            console.log(result);
            res.status(409).send({ "error_msg": "email already exist" });
        } else {
            console.log(result);
            res.status(201).send({ "customer_id": result.insertId });
        }
    })
})

// // Retrive film categories for dropdown menu
app.get("/film_category", function (req, res) {
    actor.getFilmCategory(function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    })
})

// Retrieve store id for dropdown menu
app.get("/storeID", function(req, res){
    admin.getStoreID(function(err, result){
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(result); 
        }
    })
})


// Search by Title Endpoint
app.get('/filmByTitle', function (req, res) {
    var search = req.query.search;
    var max = req.query.max;

    actor.searchForDVD(search, max, function (err, result) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(result);
        }
    })
});

// Search by Category Endpoint
app.get('/filmByCategory', function (req, res) {
    var category_id = req.query.category_id;
    var max = req.query.max;
    actor.getFilm(category_id, max, function(err, result){
        if(err){
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    })
});

// View film in detail
app.get('/film', function (req, res) {
    var film_id = req.query.film_id;

    actor.detailDVD(film_id, function (err, film) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(film);
        }
    });
});

//Administrator Login
app.post('/admin/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    admin.login(email, password, function (err, token, result) {
        if (!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password']; //clear the password in json data, do not send back to client
            console.log(result);
            res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
            res.send();
        } else {
            res.status(500);
            res.send(err.statusCode);
        }
    });
});

//Add new actor - for admin
app.post('/admin/actor', verifyToken, function (req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    admin.addNewActor(first_name, last_name, function (err, result) {
        if (err) {
            res.status(500);
            res.send(err.statuscode);
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, result: result, status: 'Record updated successfully!' });
        }
    })
});


//Add new customer - for admin
app.post('/admin/customer', verifyToken, function (req, res) {
    var address = req.body.address;
    var store_id = req.body.store_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;

    admin.addNewCustomer(address.address_line1, address.address_line2, address.district, address.city_id, address.postal_code, address.phone, store_id, first_name, last_name, email, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, result: result, status: 'Record updated successfully!' });
        }
    });
});

module.exports = app;