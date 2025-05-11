window.addEventListener('keydown', (e) => {
  const keys = [' ', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
  if (keys.includes(e.key)) {
    e.preventDefault()
  }
}, false)

window.addEventListener('gamepad1Connected', (e) => {
  
  console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length)
})

window.addEventListener('gamepad2Connected', (e) => {
  gamepad2Connected = true

  console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
  e.gamepad.index, e.gamepad.id,
  e.gamepad.buttons.length, e.gamepad.axes.length)
})

const setFullscreen = () => {
  soundButtonClick.pause()
  soundButtonClick.currentTime = 0
  playSound(soundButtonClick)
  const button = document.getElementById('fullscreen-button')

  if (!document.fullscreenElement) {
    document.body.requestFullscreen()
        .then(() => {
          button.setAttribute('data-fullscreen', 'active')
        })
        .catch(() => {
          button.setAttribute('data-fullscreen', 'inactive')
        })
  } else {
    document.exitFullscreen()
        .then(() => {
          button.setAttribute('data-fullscreen', 'inactive')
        })
        .catch(() => {
          button.setAttribute('data-fullscreen', 'active')
        })
  }
}
  
const canvas = document.getElementById('game-canvas')
const generalButtons = document.getElementById('general-buttons')
const modal = document.getElementById('modal')
const descriptionTxt = document.getElementById('description')
const trophyImage = document.getElementById('trophy')

const colorInputP1 = document.getElementById('color-picker-p1')
const colorInputP2 = document.getElementById('color-picker-p2')
const gameSpeedInput = document.getElementById('game-speed')
const pointsToWinInput = document.getElementById('points-to-win')
const paddleSizeInput = document.getElementById('paddle-size')
const difficultyCPUInput = document.getElementById('difficulty-cpu')
const obstacleInput = document.getElementById('obstacles')

const soundGoal = document.getElementById('goal')
const soundVictory = document.getElementById('victory')
const soundLose = document.getElementById('lose')
const soundBounce = document.getElementById('bounce')
const soundBounceWall = document.getElementById('bounceWall')
const soundButtonClick = document.getElementById('buttonClick')
const soundCountDown = document.getElementById('countdown')
const music = document.getElementById('music')

let colorPaddle1 = '#ed3d0d'
let colorPaddle2 = '#26ed17'

const font = '48px retro'

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
let isSinglePlayer = true
let countdownValue = 3
let pointsToWin = pointsToWinInput.value

let collisionP1 = false
let collisionP2 = false
let collisionObstacle = false
let amountObstacles = 0
let Score1 = 0
let Score2 = 0
let paddleHeight = 100
const tolerance = 20
let gameSpeed = 100
let gameSpeedModifier = 0
let difficultyCPU = 6

let touchControls = false
let touchY

colorInputP1.addEventListener('change', () => colorPaddle1 = colorInputP1.value)

colorInputP2.addEventListener('change', () => colorPaddle2 = colorInputP2.value)

gameSpeedInput.addEventListener('change', () => gameSpeed = parseInt(gameSpeedInput.value))

paddleSizeInput.addEventListener('change', () => paddleHeight = parseInt(paddleSizeInput.value))

difficultyCPUInput.addEventListener('change', () => difficultyCPU = parseInt(difficultyCPUInput.value))

pointsToWinInput.addEventListener('change', () => {
  pointsToWin = parseInt(pointsToWinInput.value)
  if (pointsToWin < 1) pointsToWin = 1
})

obstacleInput.addEventListener('change', () => amountObstacles = parseInt(obstacleInput.value))

canvas.addEventListener('touchstart', changeTouchPosition, false)
canvas.addEventListener('touchmove', changeTouchPosition, false)

window.onload = function () {
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)
  if(navigator.getGamepads()[0] !== null){
    console.log('gamepad connected')
  }
  console.log(navigator.getGamepads()[0])
}

const openSettings = () => {
  soundButtonClick.pause()
  soundButtonClick.currentTime = 0
  playSound(soundButtonClick)
  modal.showModal()
}

const closeSettings = () => {
  soundButtonClick.pause()
  soundButtonClick.currentTime = 0
  playSound(soundButtonClick)
  modal.close()
}

const setCountdown = () => {
  const countdownInterval = setInterval(() => {
    countdownValue--

    if (countdownValue === 0) {
      clearInterval(countdownInterval)
      gameStarted = true
    }
  }, 1000)
}

const startGame = (singlePlayer) => {
  soundButtonClick.pause()
  soundButtonClick.currentTime = 0
  playSound(soundButtonClick)
  playSound(soundCountDown)
  setTimeout(() => playSound(music), 3000)
  paddle1Y = canvas.height / 2 - paddleHeight / 2
  paddle2Y = canvas.height / 2 - paddleHeight / 2
  music.loop = true
  setCountdown()
  isSinglePlayer = singlePlayer
  canvas.style.display = 'block'
  canvasContext = canvas.getContext('2d')
  runGame = singlePlayer
    ? setInterval(onePlayerMode, 1000 / (gameSpeed + gameSpeedModifier))
    : setInterval(twoPlayerMode, 1000 / (gameSpeed + gameSpeedModifier))
  generalButtons.style.display = 'none'
  descriptionTxt.style.display = 'none'
}

const drawScore = () => {
  canvasContext.font = font
  canvasContext.fillStyle = 'white'
  drawCenteredText(Score1, canvas.width / 4, 60)
  drawCenteredText(Score2, canvas.width * 3 / 4, 60)
}

const twoPlayerMode = () => {
  const scored = setScore()
  const gameOver = checkGameOver()
  drawEverything()
  moveEverything()
  collision(paddle2X, paddle2Y, upPressed, downPressed, collisionP2, 1)
  collision(paddle1X, paddle1Y, wPressed, sPressed, collisionP1, 0)
  move1()
  move2()
  if (scored && !gameOver) resetAfterScore()
  drawScore()
}

function onePlayerMode () {
  const scored = setScore()
  const gameOver = checkGameOver()
  drawEverything()
  moveEverything()
  collision(paddle2X, paddle2Y, upPressed, downPressed, collisionP2, 1)
  collision(paddle1X, paddle1Y, wPressed, sPressed, collisionP1, 0)
  collisionWithObstacle()
  move1()
  move1Touch()
  if (scored && !gameOver) resetAfterScore()
  drawScore()
  moveAI()
}

const moveEverything = () => {
  if (!gameStarted) return
  ballX = ballX + ballSpeedX * ballDirectionX
  ballY = ballY + ballSpeedY * 2

  if (ballX >= canvas.width || ballX <= 0) {
    ballDirectionX = ballDirectionX * -1
  }
  
  const ballHitsBottom = ballY >= canvas.height
  const ballHitsTop = ballY <= 0

  if (ballHitsBottom || ballHitsTop) {
    ballSpeedY = -ballSpeedY
    playSound(soundBounceWall)
  }

  if (ballHitsBottom) ballY = canvas.height

  if (ballHitsTop) ballY = 0
}

const move1 = () => {
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
  if (paddle1Y > canvas.height - paddleHeight) {
    paddle1Y = canvas.height - paddleHeight
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
  if (paddle1Y > canvas.height - paddleHeight) {
    paddle1Y = canvas.height - paddleHeight
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

const move2 = () => {
  if (downPressed) {
    paddle2Y = paddle2Y + 8;
  }
  if (paddle2Y > canvas.height - paddleHeight) {
    paddle2Y = canvas.height - paddleHeight
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
  if (paddle2Y > canvas.height - paddleHeight) {
    paddle2Y = canvas.height - paddleHeight
  }
}

const moveAItoBall = () => {
  downPressed = false
  upPressed = false
  if (ballY > paddle2Y + paddleHeight / 2) {
    paddle2Y += difficultyCPU
    downPressed = true
  }

  if (ballY < paddle2Y + paddleHeight / 2) {
    paddle2Y -= difficultyCPU
    upPressed = true
  }
}

const resetAfterScore = () => {
  ballX = 395
  ballY = 300
  paddle1Y = canvas.height / 2 - paddleHeight / 2
  paddle1X = 30
  paddle2Y = canvas.height / 2 - paddleHeight / 2
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

const drawCenteredText = (text, x, y) => {
  const textWidth = canvasContext.measureText(text).width
  const centeredX = x - textWidth / 2
  canvasContext.fillText(text, centeredX, y)
}

const fadeOutMusic = () => {
  const fadeOutInterval = setInterval(() => {
    if (music.volume <= 0.2 || music.playbackRate < 0.5) clearInterval(fadeOutInterval)
    music.volume -= 0.1
    music.playbackRate -= 0.1
  }, 100)
}

const drawVictoryMessage = () => {
  const p1Wins = Score1 > Score2
  trophyImage.classList.remove('trophy-hidden')
  trophyImage.classList.add(p1Wins ? 'trophy-p1' : 'trophy-p2')
  const message1 = p1Wins ? 'Win' : 'Lose'
  const message2 = p1Wins ? 'Lose' : 'Win'
  canvasContext.font = font
  canvasContext.fillStyle = 'white'
  drawCenteredText(message1, canvas.width / 4, 350)
  drawCenteredText(message2, canvas.width * 3 / 4, 350)
}

const playSound = (sound, pitch) => {
  sound.playbackRate = pitch ?? 1
  sound.play()
}

const setScore = () => {
  const scoredByP1 = ballX >= canvas.width
  const scoredByP2 = ballX <= 0

  const scored = scoredByP1 || scoredByP2

  if(scored) {
    obstacleY = -450
    obstacle2Y = -750
    soundGoal.pause()
    soundGoal.currentTime = 0
    playSound(soundGoal)
    clearInterval(runGame)
    gameSpeedModifier = 0
    runGame = isSinglePlayer
        ? setInterval(onePlayerMode, 1000 / (gameSpeed + gameSpeedModifier))
        : setInterval(twoPlayerMode, 1000 / (gameSpeed + gameSpeedModifier))
  }
  if (scoredByP1) {
    Score1 = Score1 + 1
  }

  if (scoredByP2) {
    Score2 = Score2 + 1
  }

  return scored
}

const checkGameOver = () => {
  const p1Wins = Score1 >= pointsToWin
  const p2Wins = Score2 >= pointsToWin
  const gameOver = p1Wins || p2Wins

  if (gameOver) {
    fadeOutMusic()
    if (p2Wins && isSinglePlayer) playSound(soundLose)
    else playSound(soundVictory)
    clearInterval(runGame)
    setTimeout(() => window.location.reload(), 7000)
  }

  return gameOver
}

const collision = (paddleX, paddleY, upBTN, downBTN, collisionDetected, gamepadIndex) => {
  const gamepadConnected = navigator.getGamepads()[gamepadIndex] !== null
  const isPressedDown = downBTN || (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[13].pressed)
  const isPressedUp = upBTN || (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[12].pressed)
  const isPressedRight = dPressed || (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[15].pressed)
  const withinXRange = ballX > paddleX - 5 && ballX < paddleX + 15
  const withinYRange = ballY >= paddleY - tolerance && ballY < paddleY - 1 + paddleHeight + tolerance

  if (withinXRange && withinYRange && !collisionDetected) {
    collisionObstacle = false
    const isRightSide = ballX > canvas.width / 2
    collisionP1 = !isRightSide
    collisionP2 = isRightSide
    ballDirectionX = -ballDirectionX

    if (collisionP1 || collisionP2) {
      gameSpeedModifier += 1
      clearInterval(runGame)
      runGame = isSinglePlayer
          ? setInterval(onePlayerMode, 1000 / (gameSpeed + gameSpeedModifier))
          : setInterval(twoPlayerMode, 1000 / (gameSpeed + gameSpeedModifier))
    }

    if (collisionP1) {
      ballX += isPressedRight ? 5 : 0
      ballSpeedX = isPressedRight ? 10 : 5
      animateCollisionP1()
    }

    if (collisionP2) {
      ballX -= leftPressed ? 5 : 0
      ballSpeedX = leftPressed ? 10 : 5
      animateCollisionP2()
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
    leftPressed && collisionP2 ? playSound(soundBounce, 16) : playSound(bounce, 0.5)
    isPressedRight && collisionP1 ? playSound(soundBounce, 16) : playSound(bounce, 0.5)
  }
}

const collisionWithObstacle = () => {
  const hasAtLeastOneObstacle = amountObstacles >= 1
  const hasTwoObstacles = amountObstacles >= 2
  if (!hasAtLeastOneObstacle) return
  const withinXRange = ballX > obstacleX - 5 && ballX < obstacleX + 15
  const withinYRange =
      (ballY >= obstacleY - tolerance && ballY < obstacleY - 1 + obstacleHeight + tolerance) ||
      (hasTwoObstacles && ballY >= obstacle2Y - tolerance && ballY < obstacle2Y - 1 + obstacleHeight + tolerance)
  if (withinXRange && withinYRange && !collisionObstacle) {
    playSound(soundBounceWall)
    ballDirectionX = -ballDirectionX
    collisionObstacle = true
    collisionP1 = false
    collisionP2 = false
  }
}

const animateCollisionP1 = () => {
  paddle1X -= 6
  setTimeout(() => paddle1X += 6, 50)
  setTimeout(() => paddle1X -= 3, 100)
  setTimeout(() => paddle1X += 3, 150)
  setTimeout(() => paddle1X -= 1, 200)
  setTimeout(() => paddle1X += 1, 250)
}

const animateCollisionP2 = () => {
  paddle2X += 6
  setTimeout(() => paddle2X -= 6, 50)
  setTimeout(() => paddle2X += 3, 100)
  setTimeout(() => paddle2X -= 3, 150)
  setTimeout(() => paddle2X += 1, 200)
  setTimeout(() => paddle2X -= 1, 250)
}

let obstacleY = -450
const obstacleWidth = 10
const obstacleHeight = 100
const obstacleX = canvas.width / 2 - obstacleWidth / 2

let obstacle2Y = -750

const drawObstacles = () => {
  const hasAtLeastOneObstacle = amountObstacles >= 1
  const hasTwoObstacles = amountObstacles >= 2
  if (!hasAtLeastOneObstacle) return

  roundedRect(canvasContext, obstacleX , obstacleY, obstacleWidth, obstacleHeight, 4, 'rgba(255,0,0,0.4)')
  if (hasTwoObstacles) roundedRect(canvasContext, obstacleX , obstacle2Y, obstacleWidth, obstacleHeight, 4, 'rgba(255,0,0,0.4)')
  obstacleY++
  obstacle2Y++
  if (obstacleY > canvas.height + 100) obstacleY = -100
  if (obstacle2Y > canvas.height + 100) obstacle2Y = -100
}

const drawEverything = () => {
  canvasContext.fillStyle = 'black' /*black background*/
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  canvasContext.fillStyle = 'rgba(255,0,0,0.4)' /*middle line*/
  canvasContext.fillRect(canvas.width / 2, 0, 1, canvas.height)
  drawObstacles()
  const gameOver = checkGameOver()
  if (!gameOver) {
    roundedRect(canvasContext, ballX, ballY, 10, 10, 4, 'white') /* paddles + ball */
    roundedRect(canvasContext, paddle1X, paddle1Y, 10, paddleHeight, 4, colorPaddle1)
    roundedRect(canvasContext, paddle2X, paddle2Y, 10, paddleHeight, 4, colorPaddle2)
  }
  if (gameOver) drawVictoryMessage()
  canvasContext.fillStyle = 'white'
  if (countdownValue > 0) canvasContext.fillText(countdownValue.toString(), canvas.width / 2 - 20, canvas.height / 2 - 40)
}

let volume = 1

const setVolume = (value) => {
  if (value === null || value < 0 || value > 5) {
    volume = 1
  } else volume = Number(value) * 2 / 10
  sessionStorage.setItem('volume', value)
  const volumeElements = Array.from(document.getElementsByClassName('volume-item'))
  volumeElements.forEach(element => {
          element.innerHTML = element.dataset.value > value ? '&#9645;' : '&#11036;'
  })
  const audio = document.querySelectorAll('audio')
  audio.forEach(sound => sound.volume = volume)
}

const volumeFromSessionStorage = window.sessionStorage.getItem('volume')
if (volumeFromSessionStorage) setVolume(parseFloat(volumeFromSessionStorage))

const roundedRect = (ctx, x, y, width, height, radius, color) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.arcTo(x + width, y, x + width, y + radius, radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
  ctx.lineTo(x + radius, y + height)
  ctx.arcTo(x, y + height, x, y + height - radius, radius)
  ctx.lineTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.stroke()
}