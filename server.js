'use strict'

const express = require('express')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()

// Middlewares
app.use(session({ secret: process.env.SEGREDOSESSAO }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}
))

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

app.get('/consulta', async (req, res) => {
    connection.query('SELECT * FROM ccf.usuarios', (err, rows) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err)
            res.status(500).send('Erro ao recuperar os dados')
            return
        }
        res.json(rows)
    })
})

app.post('/logar', async (req, res) => {
    const emailUsuario = req.body.email_usuario
    const senhaUsuario = req.body.senha_usuario

    connection.query(`CALL ccf.fazer_login('${emailUsuario}', '${senhaUsuario}')`, (err, rows) => {
        if (err) {
            console.log(`CALL ccf.fazer_login('${emailUsuario}', '${senhaUsuario}')`)
            console.error('Erro ao executar a consulta:', err)
            res.status(500).send('Erro ao recuperar os dados')
            return
        } else {
            console.log('Usuário autenticado com sucesso')
            req.body.email_usuario = req.body.username
            const token = jwt.sign({ usuario: req.session.usuario }, process.env.SEGREDOTOKEN, { expiresIn: 3600 })
            console.log('Token gerado:', token)
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 3600000,
                sameSite: 'None'
            })
            try {
                //res.redirect(`/consulta.html`)
                return res.json({ auth: true, token })
            } catch (renderError) {
                console.error('Erro ao redirecionar:', renderError)
                res.status(500).send({ message: 'Erro interno ao redirecionar a página.' })
            }

            //res.json(rows)
        }
    })
})

app.post('/cadastrar', async (req, res) => {
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