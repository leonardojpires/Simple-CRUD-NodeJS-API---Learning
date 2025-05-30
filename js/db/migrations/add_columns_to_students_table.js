let con = require('../connection.js');

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "ALTER TABLE students ADD COLUMN age INT, ADD COLUMN course VARCHAR(255)";
    con.query(sql, function(err) {
        if (err) throw err;
        console.log("Columns age and course added to students table successfully!");
        con.end();
    })
})