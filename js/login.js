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

        } else { // Logar
            const emailUsuario = $('#i-email').val()
            const senhaUsuario = $('#i-senha').val()

            fetch('http://localhost/logar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email_usuario: emailUsuario,
                    senha_usuario: senhaUsuario
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error('Erro ao fazer login')
                })
                .then(data => {
                    console.log('Resposta do servidor:', data)
                })
                .catch(error => {
                    console.error('Erro:', error)
                })
        }
    })
}