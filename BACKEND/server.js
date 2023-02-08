// Admission Number: 2234865
// Author: Mahesha Uthayakumar
// Class: DIT/FT/1B/03
// File: server.js

var app=require('./controller/app.js');
var port=8081;

var server=app.listen(port,function(){
    console.log("App hosted at localhost:"+port);
});
