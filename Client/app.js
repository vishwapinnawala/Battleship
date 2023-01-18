//var element = document.getElementById("hideelement");
//element.classList.toggle("showhide");

document.addEventListener('DOMContentLoaded', () => {//Gettings Elements to Variables
  const userboard = document.querySelector('.usergrid')
  const botboard = document.querySelector('.computergrid')
  const displayboard = document.querySelector('.shipselector')
  const ships = document.querySelectorAll('.ship')
  const destroyer = document.querySelector('.destroyerwrap')
  const submarine = document.querySelector('.submarinewrap')
  const cruiser = document.querySelector('.cruiserwrap')
  const battleship = document.querySelector('.battleshipwrap')
  const carrier = document.querySelector('.carrierwrap')
  const startbtn = document.querySelector('#startbtn')
  const rotatebtn = document.querySelector('#rotatebtn')
  const singlebtn = document.querySelector('#singleplayerbtn')
  const multibtn = document.querySelector('#multiplayerbtn')
  const yourturn = document.querySelector('#yourgo')
  const showdetails = document.querySelector('#detail')
  let gamemod=""
  let playernum=0
  let status=false
  let enemystatus=false
  let shipsplaced=false
  let boomfires=-1
  
singlebtn.addEventListener('click',beginsingleplayer)
multibtn.addEventListener('click',beginmultiplayer)
  
  const userblocks = []
  const botblocks = []
  let ifHorizontal = true
  let ifGameOver = false
  let currentPlayer = 'player'
  let width=10

  
  function msglist(message){
    //var div=document.createElement('div')
    //div.innerHTML="<div id='msgbox' class='card card-text d-inline-block p-2 px-3 m-1'></div>"
    //message
    
   //msgwrap.appendChild(div)
    //const msgbox=document.getElementById('msgwrap')
    //var div=document.createElement('div')
   // div.innerHTML="<div id='mssgbox' class='card card-text d-inline-block p-2 px-3 m-1'></div>"
   // msgbox.append(div)
   // const mssgbox=document.getElementById('mssgbox')
   // mssgbox.innerText=message;
    //return message
  const msgelement = document.createElement('div')
  msgelement.innerText = message
  messageContainer.append(msgelement)
  }



  function beginmultiplayer(){
    gamemode="multi"
    const socket=io();
    const msgform=document.getElementById('sendwrapper')
    const messagedata=document.getElementById('msginput')
    const msgwrap=document.getElementById('msgwrapper')
    
    socket.on('chatmsg',msg=>{
      console.log(msg);
      msglist(msg)
    })
    const messageContainer = document.getElementById('messagewrap')
   


    msgform.addEventListener('submit',e=>{
      e.preventDefault()
      const message=messagedata.value
      socket.emit('sendmsg',message)
      messagedata.value=''
    })

    
    socket.on('playerno',num=>{
      if(num==-1){
        showdetails.innerHTML="Sorry! We are Full!!!"
      }
      else{
        playernum=parseInt(num)
        if(playernum==1) currentPlayer="Enemy"
        console.log('Enemy is '+playernum)

        socket.emit('checkplayers')
      }
    })
socket.on('connectedplayer',num=>{
  console.log('Player '+num+' Connected or disconnected')
  playerconnectstatus(num)
})

socket.on('enemystate',num=>{
  enemystatus=true
  playerstatus(num)
  if(status)multiplaygame(socket)
})

socket.on('checkplayers',players=>{
  players.forEach((p,i)=>{
    if(p.connected) playerconnectstatus(i)
    if(p.status){
      playerstatus(i)
      if(i != playernum) enemystatus=true
    }
  })
})

startbtn.addEventListener('click',()=>{
  if(shipsplaced)multiplaygame(socket)
  else showdetails.innerHTML="Please Drag and Drop All the Ships"
})

botblocks.forEach(blocks=>{
  blocks.addEventListener('click',()=>{
    if(currentPlayer=='player' && status && enemystatus){
      boomfires=blocks.dataset.id
      socket.emit('fire',boomfires)
    }
  })
})

socket.on('fire',id=>{
  botturn(id)
  const sqaureblock=userblocks[id]
  socket.emit('firereply',sqaureblock.classList)
  multiplaygame(socket)
})
socket.on('firereply',classList=>{
  showblocks(classList)
  multiplaygame(socket)
})
function multiplaygame(socket)
{
  if(ifGameOver)return
  if(!status){
    socket.emit('playerstate')
    status=true
    playerstatus(playernum)
  }
  if(enemystatus){
    if(currentPlayer=='player')
    {
      yourturn.innerHTML='Your Turn'
    }
    if(currentPlayer=='Enemy'){
      yourturn.innerHTML='Enemy Turn'
    }
  }
}

function playerstatus(num){
  let player = `.p${parseInt(num)+1}`
  document.querySelector(`${player} .ready span`).classList.toggle('green')
}

function playerconnectstatus(num){//display player connections
  let player =`.p${parseInt(num)+1}`
  document.querySelector(`${player} .connected span`).classList.toggle('green')
  if(parseInt(num)==playernum) document.querySelector(player).style.fontWeight='bold'
}

  }

  function beginsingleplayer(){
    gamemod="single"
  
    for (let i = 0; i < 5; i++) {
      generate(shipsarray[i])
    }
    startbtn.addEventListener('click', singleplayfunct)
  }

  function generateboard(grid, blocks) {//Generating the game grid
    for (let i = 0; i < width*width; i++) {
      const block = document.createElement('div')
      block.dataset.id = i
      grid.appendChild(block)
      blocks.push(block) 
    }
  }
  
  generateboard(userboard, userblocks)//generating the players board
  generateboard(botboard, botblocks) // generting the computers board

  const shipsarray = [//Making the ship sizes
    {name: 'destroyer',directions: [[0, 1],[0, width]]},
    {name: 'submarine',directions: [[0, 1, 2],[0, width, width*2]]},
    {name: 'cruiser',directions: [[0, 1, 2],[0, width, width*2]]},
    {name: 'battleship',directions: [[0, 1, 2, 3],[0, width, width*2, width*3]]},
    {name: 'carrier',directions: [[0, 1, 2, 3, 4],[0, width, width*2, width*3, width*4]]},
  ]

  

  function generate(ship) {
    let randmdirection = Math.floor(Math.random() * ship.directions.length)
    let current = ship.directions[randmdirection]
    if (randmdirection === 0)
    {
      direction = 1
    } 
    if (randmdirection === 1) 
    {
      direction = 10
    }
    let randmstart = Math.abs(
      Math.floor(
        Math.random() * botblocks.length - (
          ship.directions[0].length * direction )))

    const iftaken = current.some(index => botblocks[randmstart + index].classList.contains('taken'))
    const ifatrightedge = current.some(index => (randmstart + index) % width === width - 1)
    const ifatleftedge = current.some(index => (randmstart + index) % width === 0)

    if (!iftaken && !ifatrightedge && !ifatleftedge) current.forEach(index => 
      botblocks[randmstart + index].classList.add('taken', ship.name))

    else generate(ship)
  }
  

  
  function rotate() {
    
    if (ifHorizontal) {
      destroyer.classList.toggle('destroyer-verticle')//Css
      submarine.classList.toggle('submarine-verticle')
      cruiser.classList.toggle('cruiser-verticle')
      battleship.classList.toggle('battleship-verticle')
      carrier.classList.toggle('carrier-verticle')
      ifHorizontal = false   
      console.log(ifHorizontal)   
      return
    }
    if (!ifHorizontal) {
      destroyer.classList.toggle('destroyer-verticle')
      submarine.classList.toggle('submarine-verticle')
      cruiser.classList.toggle('cruiser-verticle')
      battleship.classList.toggle('battleship-verticle')
      carrier.classList.toggle('carrier-verticle')
      ifHorizontal = true
      console.log(ifHorizontal)
      return
    }
  }
  rotatebtn.addEventListener('click', rotate)

  ships.forEach(ship => ship.addEventListener('dragstart', dragon))
  userblocks.forEach(square => square.addEventListener('dragstart', dragon))
  userblocks.forEach(square => square.addEventListener('dragover', dragOff))
  userblocks.forEach(square => square.addEventListener('dragenter', dragin))
  userblocks.forEach(square => square.addEventListener('dragleave', dragout))
  userblocks.forEach(square => square.addEventListener('drop', Ddrop))
  userblocks.forEach(square => square.addEventListener('dragend', dend))

  let selectshipindex
  let selectedship
  let selectedshiplegth

  ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    selectshipindex = e.target.id
    console.log(selectshipindex)}
    ))

  function dragon() {
    selectedship = this
    selectedshiplegth = this.childNodes.length
  }
  
  function dragOff(e) {
    e.preventDefault()
  }
  function dragin(e) {
    e.preventDefault()
  }
  function dragout() {
    console.log('drag leave')
  }

  function Ddrop() {
    let selectshiplastid = selectedship.lastChild.id
    console.log(selectedship)
    console.log(selectedship)
    let shipsclass = selectshiplastid.slice(0,-2)
    let lastship = parseInt(selectshiplastid.substr(-1))
    let lastshipid = lastship + parseInt(this.dataset.id)
  
    const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
    const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]
    
    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastship)
    let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastship)

    selectedShipIndex = parseInt(selectshipindex.substr(-1))

    lastshipid = lastshipid - selectedShipIndex

    if (ifHorizontal && !newNotAllowedHorizontal.includes(lastshipid)) {
      for (let i=0; i < selectedshiplegth; i++) {
        userblocks[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipsclass)
      }

    } else if (!ifHorizontal && !newNotAllowedVertical.includes(lastshipid)) {
      for (let i=0; i < selectedshiplegth; i++) {
        userblocks[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', shipsclass)
      }
    } else return

    displayboard.removeChild(selectedship)
    if(!displayboard.querySelector('.ship')) shipsplaced=true
  }

  function dend() {console.log('dragend') }



  function singleplayfunct() {
    if (ifGameOver) return
    if (currentPlayer === 'player') {
      yourturn.innerHTML = 'Play Now'
      botblocks.forEach(square => square.addEventListener('click', function(e) {boomfires=square.dataset.id, showblocks(square.classList) }))
    }
    if (currentPlayer === 'bot') {
      yourturn.innerHTML = "Computer's Turn"
      setTimeout(botturn, 1000)
    }
  }
  

  let destroyerC = 0
  let submarineC = 0
  let cruiserC = 0
  let battleshipC = 0
  let carrierC = 0

  
  function showblocks(classList) {
    const enemyblock= botboard.querySelector(`div[data-id='${boomfires}']`)
    const obj=Object.values(classList)
    if (!enemyblock.classList.contains('boom') && currentPlayer== 'player' && !ifGameOver) {
      if (obj.includes('destroyer')) destroyerC++
      if (obj.includes('submarine')) submarineC++
      if (obj.includes('cruiser')) cruiserC++
      if (obj.includes('battleship')) battleshipC++
      if (obj.includes('carrier')) carrierC++
    }
    if (obj.includes('taken')) {
      enemyblock.classList.add('boom')
      console.log("Adding Bot Board Boom")
    } else {
      enemyblock.classList.add('miss')
    }
    wincheck()
    currentPlayer = 'bot'
    if(gamemod=='single')singleplayfunct()
  }

  let botDestroyerC = 0
  let botSubmarineC = 0
  let botCruiserC = 0
  let botBattleshipC = 0
  let botCarrierC = 0

  function botturn(block) {
    if(gamemod=='single')block = Math.floor(Math.random() * userblocks.length)
    if (!userblocks[block].classList.contains('boom')) {
      //console.log("Adding Player Board Boom")
      userblocks[block].classList.add('boom')
      if (userblocks[block].classList.contains('destroyer')) botDestroyerC++
      if (userblocks[block].classList.contains('submarine')) botSubmarineC++
      if (userblocks[block].classList.contains('cruiser')) botCruiserC++
      if (userblocks[block].classList.contains('battleship')) botBattleshipC++
      if (userblocks[block].classList.contains('carrier')) botCarrierC++
      wincheck()
    } else if(gamemod=='single') botturn()
    yourturn.innerHTML = 'Your Turn'
    currentPlayer = 'player'
  }

  function wincheck() {
    if (destroyerC === 2) {
      showdetails.innerHTML = "Bot's destroyer Destroyed"
      destroyerC = 10
    }
    if (submarineC === 3) {
      showdetails.innerHTML = "Bot's Submarine Destroyed"
      submarineC = 10
    }
    if (cruiserC === 3) {
      showdetails.innerHTML = "Bot's Cruiser Destroyed"
      cruiserC = 10
    }
    if (battleshipC === 4) {
      showdetails.innerHTML = "Bot's Batlleship Destroyed"
      battleshipC = 10
    }
    if (carrierC === 5) {
      showdetails.innerHTML = "Bot's Carrier Destroyed"
      carrierC = 10
    }
    if (botDestroyerC === 2) {
      showdetails.innerHTML = "Your destroyer Destroyed"
      botDestroyerC = 10
    } 
    if (botSubmarineC === 3) {
      showdetails.innerHTML = "Your submarine Destroyed"
      botSubmarineC = 10
    }
    if (botCruiserC === 3) {
      showdetails.innerHTML ="Your Cruiser Destroyed"
      botCruiserC = 10
    }
    if (botBattleshipC === 4) {
      showdetails.innerHTML = "Your Battleship Destroyed"
      botBattleshipC = 10
    }
    if (botCarrierC === 5) {
      showdetails.innerHTML = "Your Carrier Destroyed"
      botCarrierC = 10
    }
    if (
      (destroyerC + submarineC + cruiserC + battleshipC + carrierC) === 50) 
    {
      showdetails.innerHTML = "You Won :)"
      finish()
    }
    if (
      (botDestroyerC + botSubmarineC + botCruiserC + botBattleshipC + botCarrierC) === 50) 
    {
      showdetails.innerHTML = "Bot Won :("
      finish()
    }
  
  }

  function finish() {
    ifGameOver = true
    startbtn.removeEventListener('click', singleplayfunct)
  }


})