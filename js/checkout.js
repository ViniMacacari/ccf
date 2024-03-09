const url = 'http://localhost'
const porta = 80
console.log(`${url}:${porta}/consulta`)

$(document).ready(function () {
  fetch(`${url}:${porta}/consulta`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      console.log(data.auth)
      if (data.auth === false) {
        window.location.href = '/index.html'
      }
    })
    .then(() => {
    })
    .catch(error => {
      console.error('Erro ao chamar a API:', error)
    })
})