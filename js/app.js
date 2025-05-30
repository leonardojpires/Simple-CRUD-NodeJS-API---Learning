let express = require('express');
let app = express();
let con = require('./db/connection.js');

const path = require('path');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..', 'views'));

let server = app.listen(3000, function() {
    console.log(`Servidor a correr na http://localhost:3000`);
})

/* Definição das rotas */
app.get('/', function(req, res) {
    res.render('index', { title: 'ISTEC', message: 'Bem-Vindos' })
});

app.get('/alunos', function(req, res) {
    con.query('SELECT * FROM students', function(err, result) {
        if (err) throw err;
        res.render('alunos', { title: 'Alunos', alunos: result })
    })
})

app.get('/professores', function(req, res) {
    con.query('SELECT * FROM teachers', function(err, result) {
        if (err) throw err;
        res.render('professores', { title: 'Professores', professores: result })
    })
})