'use strict'

const express = require('express')
const mysql = require('mysql')
require('dotenv').config();

const app = express()
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

process.on('SIGINT', () => {
    connection.end()
    process.exit()
})