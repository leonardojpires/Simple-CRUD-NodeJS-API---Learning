let con = require('../connection.js');

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    let sql = `ALTER TABLE students ADD COLUMN teacher_id INT, ADD CONSTRAINT fK_teacher_id FOREIGN KEY (teacher_id) REFERENCES teachers(id)`;

    con.query(sql, function (err, result) {
        if (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                throw new Error('Column already exists!');
            }
            throw err;
        }

        console.log("Column teacher_id added to students table successfully!");
    });
});