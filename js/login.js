var cadEnt = 1

$(document).ready(function () {
    cadastrarOuLogar()
})

function cadastrarOuLogar() {
    $('#i-nome-completo').hide()
    $('#l-nome-completo').hide()

    $('#cadastrar-entrar').on('click', function () {
        if (cadEnt == 0) {
            $('#cadastrar-entrar').text('Se cadastre aqui!')
            $('#h2-title').text('Entre com sua conta!')
            $('#entrar-criar').text('Entrar')
            $('#i-nome-completo').hide()
            $('#l-nome-completo').hide()
            cadEnt = 1
        } else {
            $('#cadastrar-entrar').text('Entre em uma conta existente aqui!')
            $('#h2-title').text('Crie uma conta!')
            $('#entrar-criar').text('Criar')
            $('#i-nome-completo').show()
            $('#l-nome-completo').show()
            cadEnt = 0
        }
    })

    $('#entrar-criar').on('click', function () {
        if (cadEnt == 0) { // Criar conta
            const nomeCompleto = $('#i-nome-completo').val()
            const emailUsuario = $('#i-email').val()
            const senhaUsuario = $('#i-senha').val()

            fetch('http://localhost/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome_completo: nomeCompleto,
                    email_usuario: emailUsuario,
                    senha_usuario: senhaUsuario
                })
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Resposta do servidor:', response)
                        logar()
                        return response.json()
                    }
                    throw new Error('Erro ao criar conta')
                })
                .catch(error => {
                    console.error('Erro:', error)
                })
        } else { // Logar
            logar()
        }
    })
}

function logar() {
    const emailUsuario = $('#i-email').val()
    const senhaUsuario = $('#i-senha').val()

    fetch('http://localhost:80/logar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            email_usuario: emailUsuario,
            senha_usuario: senhaUsuario,
        }),
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error('Erro ao fazer login')
        })
        .then(data => {
            console.log('Resposta do servidor:', data)
            if (data.auth) {
                // Armazena o token em localStorage ou sessionStorage
                localStorage.setItem('token', data.token)

                //window.location.href = '/home.html'
            } else {
                console.error('Falha na autenticação')
            }
        })
        .catch(error => {
            console.error('Erro:', error)
        })
}