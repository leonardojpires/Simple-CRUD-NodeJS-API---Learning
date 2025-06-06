let express = require('express');
let app = express();
let con = require('./db/connection.js');

const path = require('path');

/* Middleware para JSON */
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..', 'views'));


/* ROTAS VIEWS */
/* Definição das rotas */
app.get('/', function(req, res) {
    res.render('index', { title: 'ISTEC', message: 'Bem-Vindos' })
});

app.get('/view/alunos', function(req, res) {
    con.query('SELECT * FROM students', function(err, result) {
        if (err) throw err;
        res.render('alunos', { title: 'Alunos', alunos: result })
    })
})

app.get('/view/professores', function(req, res) {
    con.query('SELECT * FROM teachers', function(err, result) {
        if (err) throw err;
        res.render('professores', { title: 'Professores', professores: result })
    })
})

app.get("/view/alunos-orientadores", function(req, res) {
    const sql = `SELECT students.name AS aluno, students.course AS curso, teachers.name AS orientador, teachers.email AS email FROM students LEFT JOIN teachers ON students.teacher_id = teachers.id`;

    con.query(sql, function(err, result) {
        if (err) return res.status(500).send(err);
        res.render('alunos_professores', {
            title: "Alunos e Orientadoress",
            message: "Lista de Alunos com os seus Professores Orientadores",
            alunos_professores: result,
        });
    });
});

/* ROTAS API */
/* ---- ALUNOS ---- */
app.get('/alunos', function(req, res) {
    con.query('SELECT * FROM students', function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/alunos/:id', function(req, res) {
    const id = req.params.id;
    con.query('SELECT * FROM students WHERE id = ?', [id], function(err, result) {
        if (err) throw res.status(500).send(err);
        if (result.length === 0) return res.status(404).send("Aluno não encontrado.");
        res.json(result[0]); /* Como chamamos um ID específico, só vem um resultado */
    });
});

app.post('/alunos', function(req, res) {
    const { name, age, course } = req.body;
    const sql = ('INSERT INTO students (name, age, course) VALUES (?, ?, ?)');
    con.query(sql, [name, age, course], function(err, result) {
        if (err) throw res.status(500).send(err);
        res.status(201).json({ id: result.insertId, name, age, course });
    });
});

app.put('/alunos/:id', function(req, res) {
    const id = req.params.id;
    const { name, age, course } = req.body;
    const sql = ('UPDATE students SET name = ?, age = ?, course = ? WHERE id = ?');
    con.query(sql, [name, age, course, id], function(err, result) {
        if (err) throw res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send("Aluno não encontrado.");
        res.status(200).json({
            message: "Aluno atualizado com sucesso!",
            aluno: { id, name, age, course }
         });
    });
});

app.delete('/alunos/:id', function(req, res) {
    const id = req.params.id;
    const sql = ('DELETE FROM students WHERE id = ?');
    con.query(sql, [id], function(err, result) {
        if (err) throw res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send("Aluno não encontrado.");
        res.send({ message: "Aluno eliminado com sucesso!" });
    });
});


/* ---- PROFESSORES ---- */
app.get('/professores', function(req, res) {
    con.query('SELECT * FROM teachers', function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/professores/:id', function(req, res) {
    const id = req.params.id;
    con.query('SELECT * FROM teachers WHERE id = ?', [id], function(err, result) {
        if (err) throw res.status(500).send(err);
        if (result.length === 0) return res.status(404).send("Professor não encontrado.");
        res.json(result[0]);
    });
});

app.post('/professores', function(req, res) {
    const { name, age, email } = req.body;
    const sql = ('INSERT INTO teachers (name, age, email) VALUES (?, ?, ?)');
    con.query(sql, [name, age, email], function(err, result) {
        if (err) throw res.status(500).send(err);
        res.status(201).json({ id: result.insertId, name, age, email });
    });
});

app.put('/professores/:id', function(req, res) {
    const id = req.params.id;
    const { name, age, email } = req.body;
    const sql = ('UPDATE teachers SET name = ?, age = ?, email = ? WHERE id = ?');
    con.query(sql, [name, age, email, id], function(err, result) {
        if (err) throw res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send("Professor não encontrado.");
        res.status(200).json({
            message: "Professor atualizado com sucesso!",
            aluno: { id, name, age, email }
         });
    });
});

app.delete('/professores/:id', function(req, res) {
    const id = req.params.id;
    const sql = ('DELETE FROM teachers WHERE id = ?');
    con.query(sql, [id], function(err, result) {
        if (err) throw res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send("Professor não encontrado.");
        res.send({ message: "Professor eliminado com sucesso!" });
    });
});

app.put('/alunos/:id/orientador', (req, res) => {
    const student_id = req.params.id;
    const { teacher_id } = req.body;

    const sql = `UPDATE students SET teacher_id = ? WHERE id = ?`;
    con.query(sql, [teacher_id, student_id], function(err, result) {
        if (err) return res.status(500).send(err);
        res.send({ message: "Professor associado ao aluno com sucesso!" });
    });
});

app.get('/alunos-orientadores', (req, res) => {
    const sql = `SELECT students.name AS aluno, IFNULL(teachers.name, 'Sem orientador') AS orientador FROM students LEFT JOIN teachers ON students.teacher_id = teachers.id`;
    con.query(sql, function(err, result) {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

let server = app.listen(3000, function() {
    console.log(`Servidor a correr na http://localhost:3000`);
});