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
})