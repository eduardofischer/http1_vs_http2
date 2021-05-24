const express = require('express')
const spdy = require('spdy')
const http = require('http')
const https = require('https')
const fs = require('fs')

// APLICAÇÃO EXPRESS
// Criação da aplicação express - essa mesma aplicação será servida por cada um dos servidores abaixo
const app = express()

// Aqui definimos o diretório de onde serão servidos os arquivos estáticos
app.use(express.static('public'))

//ENDPOINTS - Abaixo são definidos cada um dos endpoints HTTP do experimento
app.get('/', (req, res) => res.status(200).sendFile(__dirname + '/index.html'))
app.get('/inline', (req, res) => res.status(200).sendFile(__dirname + '/index_inline.html'))
app.get('/push', async (req, res) => {
  try {
    if(res.push){
      [
        "/style.css",
        "/images/img1.jpeg",
        "/images/img2.jpeg",
        "/images/img3.jpeg",
        "/images/img4.jpeg",
        "/images/img5.jpeg",
        "/images/img6.jpeg",
        "/images/img7.jpeg",
        "/images/img8.jpeg",
        "/images/img9.jpeg",
        "/images/img10.jpeg",
        "/images/img11.jpeg",
        "/images/img12.jpeg",
        "/images/img13.jpeg",
        "/images/img14.jpeg",
        "/images/img15.jpeg",
      ].forEach(async (file) => {
        res.push(file, {}).end(fs.readFileSync(`public${file}`))
      })
    } 
  } catch (e) {
    res.status(500).send(error.toString())
  }
  
  res.writeHead(200)
  res.end(fs.readFileSync("index.html"))
})

// SERVIDORES HTTP
// Definição das portas onde cada um dos servidores será servido
const HTTP1_PORT = 8000
const HTTPS1_PORT = 8001
const HTTPS2_PORT = 8002

// Certificados SSL utilizados para a criptografia HTTPS
const credentials = {
  key: fs.readFileSync(__dirname + '/server.key'),
  cert:  fs.readFileSync(__dirname + '/server.crt')
}

// Aqui criamos os 3 servidores distintos (HTTP1.1, HTTPS1.1 e HTTPS2)
const http1Server = http.createServer(app)
const https1Server = https.createServer(credentials, app)
const https2Server = spdy.createServer(credentials, app)

// Abaixo, inicializamos cada servidor em sua respectiva porta
// e imprimimos os endpoints disponíveis em cada um deles em caso de sucesso na inicialização

http1Server.listen(HTTP1_PORT, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log('Servidor HTTP 1.1:')
    console.log(`- Página HTML + CSS + Imagens: http://localhost:${HTTP1_PORT}/`)
    console.log(`- Página HTML + CSS + Imagens (Inlining): http://localhost:${HTTP1_PORT}/inline`)
    console.log(`- Texto 44Kb: http://localhost:${HTTP1_PORT}/small-text.txt`)
    console.log(`- Texto 2Mb: http://localhost:${HTTP1_PORT}/large-text.txt\n`)
  }
})

https1Server.listen(HTTPS1_PORT, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log('Servidor HTTPS 1.1:')
    console.log(`- Página HTML + CSS + Imagens: https://localhost:${HTTPS1_PORT}/`)
    console.log(`- Página HTML + CSS + Imagens (Inlining): https://localhost:${HTTPS1_PORT}/inline`)
    console.log(`- Texto 44Kb: https://localhost:${HTTPS1_PORT}/small-text.txt`)
    console.log(`- Texto 2Mb: https://localhost:${HTTPS1_PORT}/large-text.txt\n`)
  }
})

https2Server.listen(HTTPS2_PORT, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log('Servidor HTTPS 2:')
    console.log(`- Página HTML + CSS + Imagens: https://localhost:${HTTPS2_PORT}/`)
    console.log(`- Página HTML + CSS + Imagens (Server Push): https://localhost:${HTTPS2_PORT}/push`)
    console.log(`- Página HTML + CSS + Imagens (Inlining): https://localhost:${HTTPS2_PORT}/inline`)
    console.log(`- Texto 44Kb: https://localhost:${HTTPS2_PORT}/small-text.txt`)
    console.log(`- Texto 2Mb: https://localhost:${HTTPS2_PORT}/large-text.txt\n`)
  }
})