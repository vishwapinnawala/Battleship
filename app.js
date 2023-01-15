document.addEventListener('DOMContentLoaded', () => {//Gettings Elements to Variables
  const userboard = document.querySelector('.usergrid')
  const botboard = document.querySelector('.computergrid')
  const displayboard = document.querySelector('.shipselector')
  const ships = document.querySelectorAll('.ships')
  const destroyer = document.querySelector('.destroyerwrap')
  const submarine = document.querySelector('.submarinewrap')
  const cruiser = document.querySelector('.cruiserwrap')
  const battleship = document.querySelector('.battleshipwrap')
  const carrier = document.querySelector('.carrierwrap')
  const startbtn = document.querySelector('#startbtn')
  const rotatebtn = document.querySelector('#rotatebtn')
  const yourturn = document.querySelector('#yourgo')
  const showdetails = document.querySelector('#detail')

  const userblocks = []
  const botblocks = []
  let ifHorizontal = true
  let ifGameOver = false
  let currentPlayer = 'player'
  let width=10

  function generateboard(grid, blocks) {//Generating the game grid
    for (let i = 0; i < width*width; i++) {
      const block = document.createElement('div')
      block.dataset.id = i
      grid.appendChild(block)
      blocks.push(block) 
    }
  }
  

  const shipsarray = [//Making the ship sizes
    {name: 'destroyer',directions: [[0, 1],[0, width]]},
    {name: 'submarine',directions: [[0, 1, 2],[0, width, width*2]]},
    {name: 'cruiser',directions: [[0, 1, 2],[0, width, width*2]]},
    {name: 'battleship',directions: [[0, 1, 2, 3],[0, width, width*2, width*3]]},
    {name: 'carrier',directions: [[0, 1, 2, 3, 4],[0, width, width*2, width*3, width*4]]},
  ]

  generateboard(userboard, userblocks)//generating the players board
  generateboard(botboard, botblocks) // generting the computers board

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
  for (let i = 0; i < 5; i++) {
    generate(shipsarray[i])
  }

  function rotate() {
    if (ifHorizontal) {
      destroyer.classList.toggle('destroyer_verticle')//Css
      submarine.classList.toggle('submarine_verticle')
      cruiser.classList.toggle('cruiser_verticle')
      battleship.classList.toggle('battleship_verticle')
      carrier.classList.toggle('carrier_verticle')
      ifHorizontal = false      
      return
    }
    if (!ifHorizontal) {
      destroyer.classList.toggle('destroyer_verticle')
      submarine.classList.toggle('submarine_verticle')
      cruiser.classList.toggle('cruiser_verticle')
      battleship.classList.toggle('battleship_verticle')
      carrier.classList.toggle('carrier_verticle')
      ifHorizontal = true
      return
    }
  }
  rotatebtn.addEventListener('click', rotate)

  ships.forEach(ship => ship.addEventListener('dragstart', dragon))
  userblocks.forEach(square => square.addEventListener('dragstart', dragon))
  userblocks.forEach(square => square.addEventListener('dragover', dragOff))
  userblocks.forEach(square => square.addEventListener('dragenter', dragin))
  userblocks.forEach(square => square.addEventListener('dragleave', dragout))
  userblocks.forEach(square => square.addEventListener('drop', drop))
  userblocks.forEach(square => square.addEventListener('dragend', dend))

  let selectshipindex
  let selectedship
  let selectedshiplegth

  ships.forEach(ship => ship.addEventListener('mousedown', (targeta) => {selectshipindex = targeta.target.id}))

  function dragon() {selectedship = this, selectedshiplegth = this.childNodes.length}
  function dragOff(e) { e.preventDefault() }
  function dragin(e) {e.preventDefault()}
  function dragout() {}

  function drop() {
    let lastselectship = selectedship.lastChild.id
    let shipsclass = lastselectship.slice(0, -2)
    let lastship = parseInt(lastselectship.substr(-1))
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
  }

  function dend() { }

  function playfunct() {
    if (ifGameOver) return
    if (currentPlayer === 'player') {
      yourturn.innerHTML = 'Play Now'
      botblocks.forEach(square => square.addEventListener('click', function(e) {showblocks(square) }))
    }
    if (currentPlayer === 'bot') {
      yourturn.innerHTML = "Computer's Turn"//error??????
      setTimeout(botturn, 1000)
    }
  }
  startbtn.addEventListener('click', playfunct)

  let destroyerC = 0
  let submarineC = 0
  let cruiserC = 0
  let battleshipC = 0
  let carrierC = 0

  
  function showblocks(square) {
    if (!square.classList.contains('boom')) {
      if (square.classList.contains('destroyer')) destroyerC++
      if (square.classList.contains('submarine')) submarineC++
      if (square.classList.contains('cruiser')) cruiserC++
      if (square.classList.contains('battleship')) battleshipC++
      if (square.classList.contains('carrier')) carrierC++
    }
    if (square.classList.contains('taken')) {
      square.classList.add('boom')
    } else {
      square.classList.add('miss')
    }
    wincheck()
    currentPlayer = 'bot'
    playfunct()
  }

  let botDestroyerC = 0
  let botSubmarineC = 0
  let botCruiserC = 0
  let botBattleshipC = 0
  let botCarrierC = 0

  function botturn() {
    let random = Math.floor(Math.random() * userblocks.length)
    if (!userblocks[random].classList.contains('boom')) {
      userblocks[random].classList.add('boom')
      if (userblocks[random].classList.contains('destroyer')) botDestroyerC++
      if (userblocks[random].classList.contains('submarine')) botSubmarineC++
      if (userblocks[random].classList.contains('cruiser')) botCruiserC++
      if (userblocks[random].classList.contains('battleship')) botBattleshipC++
      if (userblocks[random].classList.contains('carrier')) botCarrierC++
      wincheck()
    } else botturn()
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
  



})