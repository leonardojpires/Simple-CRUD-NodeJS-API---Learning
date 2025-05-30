let con = require('../connection.js');

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "ALTER TABLE teachers ADD COLUMN age INT, ADD COLUMN email VARCHAR(255)";
    con.query(sql, function(err) {
        if (err) throw err;
        console.log("Columns age and email added to teachers table successfully!");
        con.end();
    })
})