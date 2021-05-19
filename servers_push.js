const express = require('express')
const spdy = require('spdy')
const http = require('http')
const https = require('https')
const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)

const HTTP1_PORT = 8000
const HTTPS1_PORT = 8001
const HTTPS2_PORT = 8002

const app = express()
app.use(express.static('public'))

app.get('/', async (req, res) => {
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
        res.push(file, {}).end(await readFile(`public${file}`))
      })
    } 
  } catch (e) {
    res.status(500).send(error.toString())
  }
  
  res.writeHead(200)
  res.end(await readFile("index.html"))
})

const credentials = {
  key: fs.readFileSync(__dirname + '/server.key'),
  cert:  fs.readFileSync(__dirname + '/server.crt')
}

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