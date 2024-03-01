'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
require('dotenv').config()

//app.use(bodyParser.json())

const app = express()

// Middleware para analisar corpos de solicitação JSON
app.use(bodyParser.json());

// Middleware para habilitar o CORS
app.use(cors());

const port = 80

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err)
        throw err
    }
    console.log('Conectado ao MySQL!')
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})

app.get('/consulta', (req, res) => {
    connection.query('SELECT * FROM ccf.usuarios', (err, rows) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err)
            res.status(500).send('Erro ao recuperar os dados')
            return
        }
        res.json(rows)
    })
})

app.post('/logar', (req, res) => {
    const emailUsuario = req.body.email_usuario
    const senhaUsuario = req.body.senha_usuario
    
    connection.query(`CALL ccf.fazer_login('${emailUsuario}', '${senhaUsuario}')`, (err, rows) => {
        if (err) {
            console.log(`CALL ccf.fazer_login('${emailUsuario}', '${senhaUsuario}')`)
            console.error('Erro ao executar a consulta:', err)
            res.status(500).send('Erro ao recuperar os dados')
            return
        }
        res.json(rows)
    })
})

app.post('/cadastrar', (req, res) => {
    const nomeCompleto = req.body.nome_completo
    const emailUsuario = req.body.email_usuario
    const senhaUsuario = req.body.senha_usuario
    console.log('entrou aqui1')
    connection.query(`CALL ccf.criar_usuario('${nomeCompleto}', '${emailUsuario}', '${senhaUsuario}')`, (err, rows) => {
        console.log('entrou aqui')
        if (err) {
            console.log(`CALL ccf.criar_usuario('${nomeCompleto}', '${emailUsuario}', '${senhaUsuario}')`)
            console.error('Erro ao executar a consulta:', err)
            res.status(500).send('Erro ao recuperar os dados')
            return
        }
        console.log(rows)
        res.json(rows)
    })
})

process.on('SIGINT', () => {
    connection.end()
    process.exit()
})