let con = require('./connection.js');

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE escoladb", function(err, result) {
        if (err) throw err;
        console.log("Database created");
        con.end();
    });
});