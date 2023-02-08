var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
    var token = req.headers['authorization'];
    console.log(token);

    if (!token || !token.includes('Bearer')) {
        return res.send({ auth: 'false', message: 'Not authorized!' });
    }

    else {
        token = token.split('Bearer ')[1]; 
        console.log(token);
        jwt.verify(token, config.key, function (err) {
            if (err) {
                return res.send({ auth: false, message: 'Not authorized!' });
            }
            else {
                next();
            }
        });
    }
}

module.exports = verifyToken;