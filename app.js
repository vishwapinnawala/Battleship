document.addEventListener('DOMContentLoaded', () => {
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

  function generateboard(grid, blocks) {
    for (let i = 0; i < width*width; i++) {
      const block = document.createElement('div')
      block.dataset.id = i
      grid.appendChild(block)
      blocks.push(block) 
    }
  }
  

  const shipsarray = [
    {name: 'destroyer',directions: [[0, 1],[0, width]]},
    {name: 'submarine',directions: [[0, 1, 2],[0, width, width*2]]},
    {name: 'cruiser',directions: [[0, 1, 2],[0, width, width*2]]},
    {name: 'battleship',directions: [[0, 1, 2, 3],[0, width, width*2, width*3]]},
    {name: 'carrier',directions: [[0, 1, 2, 3, 4],[0, width, width*2, width*3, width*4]]},
  ]

  generateboard(userboard, userblocks)
  generateboard(botboard, botblocks)

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

})