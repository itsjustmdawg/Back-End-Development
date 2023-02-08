// Admission Number: 2234865
// Author: Mahesha Uthayakumar
// Class: DIT/FT/1B/03
// File: databaseConfig.js

var mysql=require('mysql');

var dbConnect={

    getConnection:function(){
        var conn=mysql.createConnection({ // password = pa$$woRD123
            host:"localhost",
            user:"bed_dvd_root",
            password:"pa$$woRD123",
            database:"bed_dvd_db",
            multipleStatements: true
        });
        return conn;
    }
}
module.exports=dbConnect;