window.addEventListener("keydown", (e) => {
  const keys = [" ", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"]
  if (keys.includes(e.key)) {
    e.preventDefault()
  }
}, false)

window.addEventListener("gamepad1Connected", (e) => {
  
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length)
})

window.addEventListener("gamepad2Connected", (e) => {
  gamepad2Connected = true

  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
  e.gamepad.index, e.gamepad.id,
  e.gamepad.buttons.length, e.gamepad.axes.length)
})
  
const canvas = document.getElementById("game-canvas")
const startBtn = document.getElementById("start-button")
const soundBtn = document.getElementById("sound-button")
const descriptionTxt = document.getElementById("description")

const colorInputP1 = document.getElementById("color-picker-p1")
const colorInputP2 = document.getElementById("color-picker-p2")
const gameSpeedInput = document.getElementById("game-speed")

const onePlayerBTN = document.getElementById("1player-mode")
const twoPlayerBTN = document.getElementById("2player-mode")

const soundCheer1 = document.getElementById("cheer1")
const soundCheer2 = document.getElementById("cheer2")
const soundVictory = document.getElementById("victory")
const inputs = document.getElementById("game-settings")
const bounce = document.getElementById("bounce")
const bounceWall = document.getElementById("bounceWall")

let colorPaddle1 = "#ed3d0d"
let colorPaddle2 = "#26ed17"

const font = "48px retro"

let runGame

let gamepad2Connected = false

let canvasContext
let ballX = 395
let ballSpeedX = 5
let ballDirectionX = 1
let ballY = 300
let ballSpeedY = 0
let paddle1Y = 250
let paddle1X = 30
let paddle2Y = 250
let paddle2X = 760
let upPressed = false
let downPressed = false
let leftPressed = false
let rightPressed = false
let wPressed = false
let sPressed = false
let dPressed = false
let aPressed = false

let padUpPressed = false
let padDownPressed = false
let padLeftPressed = false
let padRightPressed = false

let gameStarted = false

let collisionP1 = false
let collisionP2 = false
let Score1 = 0
let Score2 = 0
const paddleHeight = 100
const tolerance = 20
const sounds = document.getElementsByTagName("audio")
let gameRuns = false
let gameSpeed = 100

let touchControls = false
let touchY

colorInputP1.addEventListener("change", () => {
  colorPaddle1 = colorInputP1.value
})

colorInputP2.addEventListener("change", () => {
  colorPaddle2 = colorInputP2.value
})

gameSpeedInput.addEventListener("change", () => {
  gameSpeed = gameSpeedInput.value
})

canvas.addEventListener("touchstart", changeTouchPosition, false)
canvas.addEventListener("touchmove", changeTouchPosition, false)

window.onload = function () {
  document.addEventListener("keydown", keyDownHandler, false)
  document.addEventListener("keyup", keyUpHandler, false)
  if(navigator.getGamepads()[0] !== null){
    console.log("gamepad connected")
  }
  console.log(navigator.getGamepads()[0])
}

function startGame() {
  gameStarted = true
  canvas.style.display = "block"
  canvasContext = canvas.getContext("2d")
    runGame = onePlayerBTN.checked 
      ? setInterval(onePlayerMode, 1000 / gameSpeed) 
      : setInterval(twoPlayerMode, 1000 / gameSpeed)
  startBtn.style.display = "none"
  descriptionTxt.style.display = "none"
  inputs.style.display = "none"
}

const drawScore = () => {
  canvasContext.font = font
  canvasContext.fillStyle = "white"
  canvasContext.fillText(Score1, canvas.width / 4 - 20, 60)
  canvasContext.fillText(Score2, 3 * canvas.width / 4, 60)
}

function twoPlayerMode() {
  drawEverything()
  moveEverything()
  collision(paddle2X, paddle2Y, upPressed, downPressed, collisionP2, 1)
  collision(paddle1X, paddle1Y, wPressed, sPressed, collisionP1, 0)
  move1()
  move2()
  setScore()
  drawScore()
}

function onePlayerMode () {
  drawEverything()
  moveEverything()
  collision(paddle2X, paddle2Y, upPressed, downPressed, collisionP2, 1)
  collision(paddle1X, paddle1Y, wPressed, sPressed, collisionP1, 0)
  move1()
  move1Touch()
  setScore()
  drawScore()
  moveAI()
}

const moveEverything = () => {
  ballX = ballX + ballSpeedX * ballDirectionX
  ballY = ballY + ballSpeedY * 2

  if (ballX >= canvas.width || ballX <= 0) {
    ballDirectionX = ballDirectionX * -1
  }
  
  const ballHitsBottom = ballY >= canvas.height
  const ballHitsTop = ballY <= 0

  if (ballHitsBottom || ballHitsTop) {
    ballSpeedY = -ballSpeedY
    playSound(bounceWall)
  }

  if (ballHitsBottom) ballY = canvas.height

  if (ballHitsTop) ballY = 0
}

const move1 = (event) => {
  let gamepad1Connected = navigator.getGamepads()[0] !== null

  if (gamepad1Connected) {
    move1Gamepad()
    return
  }

  if (wPressed) {
    paddle1Y -= 8
  }
  
  if (paddle1Y < 0) {
    paddle1Y = 0
  }
  if (sPressed) {
    paddle1Y += 6
  }
  if (paddle1Y > 500) {
    paddle1Y = 500
  }
  if (dPressed && paddle1X < canvas.width /2.5) {
    paddle1X += 5
  }
  if (aPressed && paddle1X > 20) {
    paddle1X -= 5
  }
}

const move1Touch = () => {
  if (touchControls) {
    if (touchY > paddle1Y) {
      paddle1Y += 10
    }

    if (touchY < paddle1Y) {
      paddle1Y -= 10
    }
  }
}

const move1Gamepad = () => {
  if (padUpPressed) {
    paddle1Y -= 8
  }
  if (paddle1Y < 0) {
    paddle1Y = 0
  }
  if (padDownPressed) {
    paddle1Y += 6
  }
  if (paddle1Y > 500) {
    paddle1Y = 500
  }
  if (padRightPressed && paddle1X < canvas.width /2.5) {
    paddle1X += 5
  }
  if (padLeftPressed && paddle1X > 20) {
    paddle1X -= 5
  }
}

function changeTouchPosition(event) {
  touchControls = true
  touchY = event.targetTouches ? event.targetTouches[0].pageY - canvas.offsetTop : event.offsetY
}

const move2 = (event) => {
  if (downPressed) {
    paddle2Y = paddle2Y + 8;
  }
  if (paddle2Y > 500) {
    paddle2Y = 500
  }
  if (upPressed) {
    paddle2Y = paddle2Y - 6;
  }
  if (paddle2Y < 0) {
    paddle2Y = 0
  }
  if (rightPressed && paddle2X < canvas.width - 20) {
    paddle2X += 5
  }
  if (leftPressed && paddle2X > canvas.width - canvas.width /2.5) {
    paddle2X -= 5
  }

}

const moveAI = () => {
  if (ballSpeedX > 0) {
    moveAItoBall()
  }
  if (paddle2Y < 0) {
    paddle2Y = 0
  }
  if (paddle2Y > 500) {
    paddle2Y = 500
  }
}

const moveAItoBall = () => {
  downPressed = false
  upPressed = false
  if (ballY > paddle2Y + 50) {
    paddle2Y += 4
    downPressed
  }

  if (ballY < paddle2Y + 50) {
    paddle2Y -= 4
    upPressed
  }
}

const resetAfterScore = () => {
  ballX = 395
  ballY = 300
  paddle1Y = 250
  paddle1X = 30
  paddle2Y = 250
  paddle2X = 760
  ballSpeedY = 0
  let p1Scored = ballDirectionX < 0
  ballDirectionX = 0
  setTimeout(() => {
    ballDirectionX = p1Scored ? 1 : -1
    ballSpeedX = 5
  }, 1000)
}

const keyDownHandler = (event) => {
  switch (event.key) {
    case 'w': {
      wPressed = true
      break
    }
    case 'a': {
      aPressed = true
      break
    }
    case 'd': {
      dPressed = true
      break
    }
    case 's': {
      sPressed = true
      break
    }
    case 'ArrowUp': {
      upPressed = true
      break
    }
    case 'ArrowDown': {
      downPressed = true
      break
    }
    case 'ArrowLeft': {
      leftPressed = true
      break
    }
    case 'ArrowRight': {
      rightPressed = true
    }
  }
}

const keyUpHandler = (event) => {
  switch (event.key) {
    case 'w': {
      wPressed = false
      break
    }
    case 'a': {
      aPressed = false
      break
    }
    case 'd': {
      dPressed = false
      break
    }
    case 's': {
      sPressed = false
      break
    }
    case 'ArrowUp': {
      upPressed = false
      break
    }
    case 'ArrowDown': {
      downPressed = false
      break
    }
    case 'ArrowLeft': {
      leftPressed = false
      break
    }
    case 'ArrowRight': {
      rightPressed = false
    }
  }
}

const drawVictoryMessage = (p1Wins) => {
  const message1 = p1Wins ? "Win" : "Lose"
  const message2 = p1Wins ? "Lose" : "Win"
  canvasContext.font = font
  canvasContext.fillStyle = "white"
  canvasContext.fillText(message1, 120, 350)
  canvasContext.fillText(message2, 130 + canvas.width / 2, 350)
}

const playSound = (sound) => {
  sound.play()
}

const setScore = () => {
  const scored = ballX >= canvas.width || ballX <= 0
  if (ballX >= canvas.width) {
    Score1 = Score1 + 1
    playSound(soundCheer1)
  }

  if (ballX <= 0) {
    Score2 = Score2 + 1
    playSound(soundCheer2)
  }

  const p1Wins = Score1 >= 7
  const p2Wins = Score2 >= 7

  if (p1Wins || p2Wins) {
    playSound(soundVictory)
    clearInterval(runGame)
    setTimeout(() => window.location.reload(), 5000)
    drawVictoryMessage(p1Wins)
    return
  }

  if (scored) {
    resetAfterScore()
  }
}

const collision = (paddleX, paddleY, upBTN, downBTN, collisionDetected, gamepadIndex) => {
  const gamepadConnected = navigator.getGamepads()[gamepadIndex] !== null
  const isPressedDown = downBTN || (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[13].pressed)
  const isPressedUp = upBTN || (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[12].pressed)
  const isPressedRight = dPressed || (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[15].pressed)
  const withinXRange = ballX > paddleX - 5 && ballX < paddleX + 15
  const withinYRange = ballY >= paddleY - tolerance && ballY < paddleY - 1 + paddleHeight + tolerance

  if (withinXRange && withinYRange && !collisionDetected) {
    const isRightSide = ballX > canvas.width / 2
    collisionP1 = !isRightSide
    collisionP2 = isRightSide
    ballDirectionX = -ballDirectionX

    if (collisionP1) {
      ballX += isPressedRight ? 5 : 0
      ballSpeedX = isPressedRight ? 10 : 5
    }

    if (collisionP2) {
      ballX -= leftPressed ? 5 : 0
      ballSpeedX = leftPressed ? 10 : 5
    }

    if (ballSpeedY === 0) {
      ballSpeedY = 2
    }

    if (isPressedDown && ballSpeedY < 0) {
      ballSpeedY -= 1
    }

    if (isPressedUp && ballSpeedY > 0) {
      ballSpeedY += 1
    }
    playSound(bounce)
  }
}

const drawEverything = () => {
  canvasContext.fillStyle = "black"; /*black background*/
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  canvasContext.fillStyle = "red"; /*middle line*/
  canvasContext.fillRect(canvas.width / 2, 0, 1, canvas.height)
  canvasContext.fillStyle = "white"; /*ball*/
  canvasContext.fillRect(ballX, ballY, 10, 10)
  canvasContext.fillStyle = colorPaddle1;/*Paddle1*/
  canvasContext.fillRect(paddle1X, paddle1Y, 10, paddleHeight)
  canvasContext.fillStyle = colorPaddle2; /*Paddle2*/
  canvasContext.fillRect(paddle2X, paddle2Y, 10, paddleHeight)
}

let volume = 1
function setVolume(value) {
  volume = value === 0 ? 0 : value * 2 / 10
  const volumeElements = Array.from(document.getElementsByClassName('volume-item'))
  volumeElements.forEach(element => {
          element.innerHTML = element.dataset.value > value ? '&#9645;' : '&#11036;'
  })
  const audio = document.querySelectorAll('audio')
  audio.forEach(sound => sound.volume = volume)
}

const burgerMenu = document.getElementById("burger-menu")
const hamburger = document.getElementById("hamburger")
let burgerMenuShowing = false

const showMenu = () => {
  burgerMenuShowing = !burgerMenuShowing
  if (burgerMenuShowing) {
    burgerMenu.style.height = "100vh"
    burgerMenu.style.opacity = "0.99"
    hamburger.style.position = "fixed"
    return
  }

  burgerMenu.style.height = "0vh"
  burgerMenu.style.opacity = "0"
  hamburger.style.position = "absolute"
}