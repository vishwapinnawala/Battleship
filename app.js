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

})