const http = require('http')

// 🔥 CORS (esto arregla el error)
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

const server = http.createServer((req, res) => {

  // 👉 necesario para CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/enviar-correo') {

    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      const { nombre } = JSON.parse(body)

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 're_Mn3dVRMQ_HNFUkdzahrSWmurJRSEgwRYi', // 🔴 PON TU KEY
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: 'vicente.alvarez2@mail.udp.cl',
            subject: '🚨 ALERTA DE ROBO',
            html: `
              <h2>🚨 ALERTA DE SEGURIDAD</h2>
              <p>Se detectó un posible robo.</p>
              <p><strong>Usuario:</strong> ${nombre}</p>
            `
          })
        })

        res.writeHead(200, headers)
        res.end('Correo enviado')

      } catch (error) {
        console.log('ERROR BACKEND:', error)
        res.writeHead(500, headers)
        res.end('Error')
      }
    })

  } else {
    res.writeHead(404, headers)
    res.end()
  }
})

server.listen(3000, () => console.log('Servidor funcionando 🚀'))