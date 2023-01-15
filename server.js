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
   //console.log('Someone Connected');
    //sock.emit('message','You Connected to Server!');
  let playerno=-1;
  for(const i in connections){
    if(connections[i]==null){
        playerno=i
        break
    }
  }
 

  sock.emit('playerno',playerno);
  console.log('Player '+playerno+' Connected')


   

  if(playerno==-1)return

  connections[playerno]=false
  sock.broadcast.emit('connectedplayer',playerno)

  sock.on('disconnect', function(){
    console.log('Player '+playerno+" Disconnected");
    connections[playerno]=null
    sock.broadcast.emit('connectedplayer',playerno)
})
sock.on('playerstate',()=>{
    sock.broadcast.emit('enemystate',playerno)
    connections[playerno]=true
})

sock.on('checkplayers',()=>{
    const  players =[]
    for(const i in connections){
        connections[i]==null? players.push({connected: false, ready: false}):
        players.push({connected:true,ready:connections[i]})
    }
    sock.emit('checkplayers',players)
})
sock.on('fire',id=>{
    sock.broadcast.emit('fire',id)
})
sock.on('firereply',square=>{
    sock.broadcast.emit('firereply',square)
})
}) 