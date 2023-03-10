const express=require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port = process.env.PORT || 3000 
//const { MongoClient, ServerApiVersion } = require('mongodb');
//const mongo=require('mongodb').MongoClient;
//const uri = "mongodb+srv://vishwapinnawala:9ieB5p6ohbsEZqT8@cluster0.3qufw4p.mongodb.net/Battleship?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//
//const database = client.db("Battleship");
//const haiku = database.collection("Chat");
//const doc = {
  //  title: "Record of a Shriveled Datum",
   // content: "No bytes, no problem. Just insert a document, in MongoDB",
  //}
  //const result = haiku.insertOne(doc);

  function uploadhighscore(name,score){
    const { MongoClient, ServerApiVersion } = require('mongodb');
    //const mongo=require('mongodb').MongoClient;
    const uri = "mongodb+srv://vishwapinnawala:9ieB5p6ohbsEZqT8@cluster0.3qufw4p.mongodb.net/Battleship?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    
    const database = client.db("Battleship");
    const scores = database.collection("Highscores");
    const doc = {
      Username: name,
      Time: score,
      }
      const result = scores.insertOne(doc);
      return result;
     }

app.use(express.static(path.join(__dirname,"Client")))

server.listen(port,()=>console.log("Server running on port "+port))
const connections=[null,null]
io.on('connection',(sock)=>{

    sock.on('highscores',function(data) {
           var scorename = data.name
           var score = data.score 
    console.log(scorename+ score)
    console.log(uploadhighscore(scorename,score))
     });

    //sock.emit('chatmsg','Hellloooo');

 sock.on('sendmsg',message=>{
     sock.broadcast.emit('chatmsg',message)
   })
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
    console.log(`Fired by ${playerno}` +'to Block', id)//
})
sock.on('firereply',square=>{
    sock.broadcast.emit('firereply',square)
    
})
setTimeout(() => {
    connections[playerno]==null
    sock.timeout
}, 600000);

}) 