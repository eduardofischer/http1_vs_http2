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

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html')
})

const http1Server = http.createServer(app)
const https1Server = https.createServer(credentials, app)
const https2Server = spdy.createServer(credentials, app)

http1Server.listen(HTTP1_PORT, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log(`Servidor HTTP 1.1 online em http://localhost:${HTTP1_PORT}/`)
  }
})

https1Server.listen(HTTPS1_PORT, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log(`Servidor HTTPS 1.1 online em https://localhost:${HTTPS1_PORT}/`)
  }
})

https2Server.listen(HTTPS2_PORT, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log(`Servidor HTTPS 2 online em https://localhost:${HTTPS2_PORT}/`)
  }
})