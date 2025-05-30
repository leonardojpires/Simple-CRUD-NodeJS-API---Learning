let con = require('../connection.js');

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "CREATE TABLE students (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table students created successfully!");
        con.end();
    });
});