const express=require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port=3000

app.use(express.static(path.join(__dirname,"Client")))

server.listen(port,()=>console.log("Server running on port "+port))

io.on('connection',socket=>{
    console.log('listenre')
})
