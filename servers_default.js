const express = require('express')
const spdy = require('spdy')
const http = require('http')
const https = require('https')
const fs = require('fs')

const app = express()

const HTTP1_PORT = 8000
const HTTPS1_PORT = 8001
const HTTPS2_PORT = 8002

const credentials = {
  key: fs.readFileSync(__dirname + '/server.key'),
  cert:  fs.readFileSync(__dirname + '/server.crt')
}

app.use(express.static('public'))

app.get('/', (req, res) => res.status(200).sendFile(__dirname + '/index.html'))
app.get('/inline', (req, res) => res.status(200).sendFile(__dirname + '/index_inline.html'))

const http1Server = http.createServer(app)
const https1Server = https.createServer(credentials, app)
const https2Server = spdy.createServer(credentials, app)

http1Server.listen(HTTP1_PORT, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log('Servidor HTTP 1.1:')
    console.log(`- Página HTML + CSS + Imagens: http://localhost:${HTTP1_PORT}/`)
    console.log(`- Texto 44Kb: http://localhost:${HTTP1_PORT}/small-text.txt`)
    console.log(`- Texto 2Mb: http://localhost:${HTTP1_PORT}/large-text.txt\n`)
  }
})

https1Server.listen(HTTPS1_PORT, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log('Servidor HTTPsS 1.1:')
    console.log(`- Página HTML + CSS + Imagens: http://localhost:${HTTPS1_PORT}/`)
    console.log(`- Texto 44Kb: http://localhost:${HTTPS1_PORT}/small-text.txt`)
    console.log(`- Texto 2Mb: http://localhost:${HTTPS1_PORT}/large-text.txt\n`)
  }
})

https2Server.listen(HTTPS2_PORT, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log('Servidor HTTPS 2:')
    console.log(`- Página HTML + CSS + Imagens: http://localhost:${HTTPS2_PORT}/`)
    console.log(`- Texto 44Kb: http://localhost:${HTTPS2_PORT}/small-text.txt`)
    console.log(`- Texto 2Mb: http://localhost:${HTTPS2_PORT}/large-text.txt\n`)
  }
})