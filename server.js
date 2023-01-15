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
const connections=[null,null]
io.on('connection',(sock)=>{
    console.log('Someone Connected');
    //sock.emit('message','You Connected to Server!');
  
    sock.on('disconnect', function(){
      console.log('User Disconnected');
  })}) 