const canvas = document.getElementById('game-canvas')
const generalButtons = document.getElementById('general-buttons')
const modal = document.getElementById('modal')
const modalTrophies = document.getElementById('modal-trophies')
const trophyImage = document.getElementById('trophy')

const inputs = {
  colorPaddle1: document.getElementById('color-picker-p1'),
  colorPaddle2: document.getElementById('color-picker-p2'),
  gameSpeed: document.getElementById('game-speed'),
  pointsToWin: document.getElementById('points-to-win'),
  paddleSize: document.getElementById('paddle-size'),
  difficultyCPU: document.getElementById('difficulty-cpu'),
  obstacles: document.getElementById('obstacles'),
}

const sounds = {
  goal: document.getElementById('goal'),
  victory: document.getElementById('victory'),
  lose: document.getElementById('lose'),
  bounce: document.getElementById('bounce'),
  bounceWall: document.getElementById('bounceWall'),
  buttonClick: document.getElementById('buttonClick'),
  countDown: document.getElementById('countdown'),
  music: document.getElementById('music'),
}

let runGame

let gamepad2Connected = false

let canvasContext

let trophies = {
  firstWin: {
    message: 'win a game',
    unlocked: false,
    id: 'win-trophy',
  },
  rallies: {
    message: '20 consecutive rallies',
    unlocked: false,
    id: 'rallies-trophy',
  },
  miniPaddle: {
    message: 'win game with mini paddle',
    unlocked: false,
    id: 'mini-paddle-trophy',
  },
  hardCPU: {
    message: 'win against highest difficulty CPU',
    unlocked: false,
    id: 'highest-difficulty-trophy',
  },
  obstacles: {
    message: 'win with two obstacles',
    unlocked: false,
    id: 'obstacles-trophy',
  },
  multiplayer: {
    message: 'win multiplayer game',
    unlocked: false,
    id: 'multiplayer-trophy',
  },
}

const gameStates = {
  notStarted: 'game not started yet',
  gameRunning: 'game currently running',
  gameOver: 'game over'
}

const settings = {
  gameState: gameStates.notStarted,
  isSinglePlayer: true,
  difficultyCPU: 6,
  pointsToWin: inputs.pointsToWin.value,
  gameSpeed: 100,
  gameSpeedModifier: 0,
  amountObstacles: 0,
  countdownValue: 3,
  tolerance: 20,
  font: '48px retro',
  paddleHeight: parseInt(inputs.paddleSize.value),
}

const ball = {
  x: 395,
  y: 300,
  speedX: 5,
  speedY: 0,
  directionX: 1,
}

const paddle1 = {
  x: 30,
  y: 250,
  height: settings.paddleHeight,
  score: 0,
  color: '#00ff00',
  collision: false,
}

const paddle2 = {
  x: 760,
  y: 250,
  height: settings.paddleHeight,
  score: 0,
  color: '#FFA500',
  collision: false,
}

const obstacle1 = {
  x: canvas.width / 2 - 5,
  y: -450,
  width: 10,
  height: 100,
  collision: false,
}

const obstacle2 = {
  x: canvas.width / 2 - 5,
  y: -750,
  width: 10,
  height: 100,
  collision: false,
}

const buttonsPressed = {
  up: false,
  down: false,
  left: false,
  right: false,
  w: false,
  a: false,
  s: false,
  d: false,
  padUp: false,
  padDown: false,
  padLeft: false,
  padRight: false,
}

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

inputs.colorPaddle1.addEventListener('change', () => paddle1.color = inputs.colorPaddle1.value)

inputs.colorPaddle2.addEventListener('change', () => paddle2.color = inputs.colorPaddle2.value)

inputs.gameSpeed.addEventListener('change', () => settings.gameSpeed = parseInt(inputs.gameSpeed.value))

inputs.paddleSize.addEventListener('change', () => {
  settings.paddleHeight = parseInt(inputs.paddleSize.value)
  paddle1.height = settings.paddleHeight
  paddle2.height = settings.paddleHeight
})

inputs.difficultyCPU.addEventListener('change', () => settings.difficultyCPU = parseInt(inputs.difficultyCPU.value))

inputs.pointsToWin.addEventListener('change', () => {
  settings.pointsToWin = parseInt(inputs.pointsToWin.value)
  if (settings.pointsToWin < 1) settings.pointsToWin = 1
})

inputs.obstacles.addEventListener('change', () => settings.amountObstacles = parseInt(inputs.obstacles.value))

window.onload = () => {
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)
  if (navigator.getGamepads()[0] !== null) {
    console.log('gamepad connected')
  }
  console.log(navigator.getGamepads()[0])
}

const setFullscreen = () => {
  playSound(sounds.buttonClick)
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

const openSettings = () => {
  playSound(sounds.buttonClick)
  modal.showModal()
}

const closeSettings = () => {
  playSound(sounds.buttonClick)
  modal.close()
}

const openTrophies = () => {
  playSound(sounds.buttonClick)
  modalTrophies.showModal()
}

const closeTrophies = () => {
  playSound(sounds.buttonClick)
  modalTrophies.close()
}

const setCountdown = () => {
  const countdownInterval = setInterval(() => {
    settings.countdownValue--

    if (settings.countdownValue === 0) {
      clearInterval(countdownInterval)
      settings.gameState = gameStates.gameRunning
    }
  }, 1000)
}

const startGame = (singlePlayer) => {
  playSound(sounds.buttonClick)
  playSound(sounds.countDown)
  setTimeout(() => playSound(sounds.music), 3000)
  sounds.music.loop = true
  paddle1.y = canvas.height / 2 - paddle1.height / 2
  paddle2.y = canvas.height / 2 - paddle2.height / 2
  setCountdown()
  settings.isSinglePlayer = singlePlayer
  canvas.style.display = 'block'
  canvasContext = canvas.getContext('2d')
  canvasContext.shadowBlur = 4
  canvasContext.shadowColor = '#55ffff99'
  runGame = singlePlayer
    ? setInterval(onePlayerMode, 1000 / (settings.gameSpeed + settings.gameSpeedModifier))
    : setInterval(twoPlayerMode, 1000 / (settings.gameSpeed + settings.gameSpeedModifier))
  generalButtons.style.display = 'none'
}

const drawScore = () => {
  canvasContext.font = settings.font
  canvasContext.fillStyle = 'white'
  drawCenteredText(paddle1.score, canvas.width / 4, 60)
  drawCenteredText(paddle2.score, canvas.width * 3 / 4, 60)
}

const twoPlayerMode = () => {
  const scored = setScore()
  checkGameOver()
  drawEverything()
  moveEverything()
  collision(paddle2, buttonsPressed.up, buttonsPressed.down, 1)
  collision(paddle1, buttonsPressed.w, buttonsPressed.s, 0)
  collisionWithObstacle()
  move1()
  move2()
  if (scored) resetAfterScore()
  drawScore()
}

const onePlayerMode = () => {
  const scored = setScore()
  checkGameOver()
  drawEverything()
  moveEverything()
  collision(paddle2, buttonsPressed.up, buttonsPressed.down, 1)
  collision(paddle1, buttonsPressed.w, buttonsPressed.s, 0)
  collisionWithObstacle()
  move1()
  if (scored) resetAfterScore()
  drawScore()
  moveAI()
}

const moveEverything = () => {
  if (settings.gameState !== gameStates.gameRunning) return
  ball.x = ball.x + ball.speedX * ball.directionX
  ball.y = ball.y + ball.speedY * 2

  if (ball.x >= canvas.width || ball.x <= 0) {
    ball.directionX = ball.directionX * -1
  }
  
  const ballHitsBottom = ball.y >= canvas.height
  const ballHitsTop = ball.y <= 0

  if (ballHitsBottom || ballHitsTop) {
    ball.speedY = -ball.speedY
    playSound(sounds.bounceWall)
  }

  if (ballHitsBottom) ball.y = canvas.height

  if (ballHitsTop) ball.y = 0
}

const move1 = () => {
  let gamepad1Connected = navigator.getGamepads()[0] !== null

  if (gamepad1Connected) {
    move1Gamepad()
    return
  }

  if (buttonsPressed.w) {
    paddle1.y -= 8
  }
  if (paddle1.y < 0) {
    paddle1.y = 0
  }
  if (buttonsPressed.s) {
    paddle1.y += 6
  }
  if (paddle1.y > canvas.height - paddle1.height) {
    paddle1.y = canvas.height - paddle1.height
  }
  if (buttonsPressed.d && paddle1.x < canvas.width /2.5) {
    paddle1.x += 5
  }
  if (buttonsPressed.a && paddle1.x > 20) {
    paddle1.x -= 5
  }
}

const move1Gamepad = () => {
  if (buttonsPressed.padUp) {
    paddle1.y -= 8
  }
  if (paddle1.y < 0) {
    paddle1.y = 0
  }
  if (buttonsPressed.padDown) {
    paddle1.y += 6
  }
  if (paddle1.y > canvas.height - paddle1.height) {
    paddle1.y = canvas.height - paddle1.height
  }
  if (buttonsPressed.padRight && paddle1.x < canvas.width / 2.5) {
    paddle1.x += 5
  }
  if (buttonsPressed.padLeft && paddle1.x > 20) {
    paddle1.x -= 5
  }
}

const move2 = () => {
  if (buttonsPressed.down) {
    paddle2.y = paddle2.y + 8;
  }
  if (paddle2.y > canvas.height - paddle2.height) {
    paddle2.y = canvas.height - paddle2.height
  }
  if (buttonsPressed.up) {
    paddle2.y = paddle2.y - 6;
  }
  if (paddle2.y < 0) {
    paddle2.y = 0
  }
  if (buttonsPressed.right && paddle2.x < canvas.width - 20) {
    paddle2.x += 5
  }
  if (buttonsPressed.left && paddle2.x > canvas.width - canvas.width /2.5) {
    paddle2.x -= 5
  }

}

const moveAI = () => {
  if (ball.speedX > 0) {
    moveAItoBall()
  }
  if (paddle2.y < 0) {
    paddle2.y = 0
  }
  if (paddle2.y > canvas.height - paddle2.height) {
    paddle2.y = canvas.height - paddle2.height
  }
}

const moveAItoBall = () => {
  buttonsPressed.down = false
  buttonsPressed.up = false
  if (ball.y > paddle2.y + paddle2.height / 2) {
    paddle2.y += settings.difficultyCPU
    buttonsPressed.down = true
  }

  if (ball.y < paddle2.y + paddle2.height / 2) {
    paddle2.y -= settings.difficultyCPU
    buttonsPressed.up = true
  }
}

const resetAfterScore = () => {
  if (settings.gameState === gameStates.gameOver) return
  let backgroundOpacity = 0
  let textOpacity = 0.5
  const drawGoalAnimation = setInterval(() => {
    canvasContext.fillStyle = `rgba(255,0,0,${backgroundOpacity})`
    backgroundOpacity += 0.2
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    drawLetter(letterG, 100, canvas.height / 2 - 40, textOpacity)
    drawLetter(letterO, 220, canvas.height / 2 - 40, textOpacity)
    drawLetter(letterA, 340, canvas.height / 2 - 40, textOpacity)
    drawLetter(letterL, 460, canvas.height / 2 - 40, textOpacity)
    drawLetter(exclamationMark, 580, canvas.height / 2 - 40, textOpacity)
    if (textOpacity === 0.5) textOpacity = 1
    else textOpacity = 0.5
  }, 50)

  setTimeout(() => {
    clearInterval(drawGoalAnimation)
    if (settings.gameState === gameStates.gameOver) return
    animationOpacity = 0
    ball.x = 395
    ball.y = 300
    paddle1.y = canvas.height / 2 - paddle1.height / 2
    paddle1.x = 30
    paddle2.y = canvas.height / 2 - paddle2.height / 2
    paddle2.x = 760
    ball.speedY = 0
    let p1Scored = ball.directionX < 0
    ball.directionX = 0
    setTimeout(() => {
      ball.directionX = p1Scored ? 1 : -1
      ball.speedX = 5
    }, 1000)
  }, 2000)
}

const keyDownHandler = (event) => {
  switch (event.key) {
    case 'w': {
      buttonsPressed.w = true
      break
    }
    case 'a': {
      buttonsPressed.a = true
      break
    }
    case 'd': {
      buttonsPressed.d = true
      break
    }
    case 's': {
      buttonsPressed.s = true
      break
    }
    case 'ArrowUp': {
      buttonsPressed.up = true
      break
    }
    case 'ArrowDown': {
      buttonsPressed.down = true
      break
    }
    case 'ArrowLeft': {
      buttonsPressed.left = true
      break
    }
    case 'ArrowRight': {
      buttonsPressed.right = true
    }
  }
}

const keyUpHandler = (event) => {
  switch (event.key) {
    case 'w': {
      buttonsPressed.w = false
      break
    }
    case 'a': {
      buttonsPressed.a = false
      break
    }
    case 'd': {
      buttonsPressed.d = false
      break
    }
    case 's': {
      buttonsPressed.s = false
      break
    }
    case 'ArrowUp': {
      buttonsPressed.up = false
      break
    }
    case 'ArrowDown': {
      buttonsPressed.down = false
      break
    }
    case 'ArrowLeft': {
      buttonsPressed.left = false
      break
    }
    case 'ArrowRight': {
      buttonsPressed.right = false
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
    if (sounds.music.volume <= 0.2 || sounds.music.playbackRate < 0.5) clearInterval(fadeOutInterval)
    sounds.music.volume -= 0.1
    sounds.music.playbackRate -= 0.1
  }, 100)
}

const drawVictoryMessage = () => {
  const p1Wins = paddle1.score > paddle2.score
  trophyImage.classList.remove('trophy-hidden')
  trophyImage.classList.add(p1Wins ? 'trophy-p1' : 'trophy-p2')
  const message1 = p1Wins ? 'Win' : 'Lose'
  const message2 = p1Wins ? 'Lose' : 'Win'
  canvasContext.fillStyle = 'white'
  drawCenteredText(message1, canvas.width / 4, 350)
  drawCenteredText(message2, canvas.width * 3 / 4, 350)
}

const playSound = (sound, pitch) => {
  sound.pause()
  sound.currentTime = 0
  sound.playbackRate = pitch ?? 1
  setTimeout(() => {
    sound.play().catch(error => {
      console.error('Playback failed:', error)
    })
  }, 0)
}

const setScore = () => {
  if (settings.gameState === gameStates.gameOver) return
  const scoredByP1 = ball.x >= canvas.width
  const scoredByP2 = ball.x <= 0

  const scored = scoredByP1 || scoredByP2

  if(scored) {
    obstacle1.y = -450
    obstacle2.y = -750
    playSound(sounds.goal)
    clearInterval(runGame)
    settings.gameSpeedModifier = 0
    setTimeout(() => {
      runGame = settings.isSinglePlayer
          ? setInterval(onePlayerMode, 1000 / (settings.gameSpeed + settings.gameSpeedModifier))
          : setInterval(twoPlayerMode, 1000 / (settings.gameSpeed + settings.gameSpeedModifier))
    }, 2000)
  }

  if (scoredByP1) {
    paddle1.score++
  }

  if (scoredByP2) {
    paddle2.score++
  }

  return scored
}

const checkGameOver = () => {
  if (settings.gameState === gameStates.gameOver) return
  const p1Wins = paddle1.score >= settings.pointsToWin
  const p2Wins = paddle2.score >= settings.pointsToWin
  const gameOver = p1Wins || p2Wins

  if (gameOver) {
    fadeOutMusic()
    handleAchievedTrophies(p1Wins)
    if (p2Wins && settings.isSinglePlayer) playSound(sounds.lose)
    else playSound(sounds.victory)
    clearInterval(runGame)
    setTimeout(() => window.location.reload(), 10000)
    settings.gameState = gameStates.gameOver
  }
}

const checkTrophiesInLocalStorage = () => {
  const trophiesFromStorage = localStorage.getItem('trophies')

  if(!trophiesFromStorage) return

  trophies = JSON.parse(trophiesFromStorage)
  Object.entries(trophies).forEach(([_, trophy]) => {
    if (trophy.unlocked) {
      const element = document.getElementById(trophy.id)
      if (!element) return
      element.classList.add('unlocked')
    }
  })
}

checkTrophiesInLocalStorage()

const handleAchievedTrophies = (p1Wins) => {
  const achievedTrophies = []

  if (p1Wins && !trophies.firstWin.unlocked) {
    trophies.firstWin.unlocked = true
    achievedTrophies.push(trophies.firstWin)
  }

  if (p1Wins && settings.amountObstacles > 1 && !trophies.obstacles.unlocked) {
    trophies.obstacles.unlocked = true
    achievedTrophies.push(trophies.obstacles)
  }

  if (p1Wins && settings.difficultyCPU >= 9 && !trophies.hardCPU.unlocked) {
    trophies.hardCPU.unlocked = true
    achievedTrophies.push(trophies.hardCPU)
  }

  if (p1Wins && !settings.isSinglePlayer && !trophies.multiplayer.unlocked) {
    trophies.multiplayer.unlocked = true
    achievedTrophies.push(trophies.multiplayer)
  }

  if (p1Wins && settings.paddleHeight <= 50 && !trophies.miniPaddle.unlocked) {
    trophies.miniPaddle.unlocked = true
    achievedTrophies.push(trophies.miniPaddle)
  }

  achievedTrophies.forEach((item, index) => {
    setTimeout(() => {
      showTrophyToast(item)
    }, index * 1000)
  })

  localStorage.setItem('trophies', JSON.stringify(trophies))
}

const showTrophyToast = (trophy) => {
  playSound(sounds.buttonClick)
  const div = document.createElement('div')
  div.innerHTML = `
        <img class='trophy-toast' src='images/pong/trophy.gif' alt='trophy-icon' />
        <span>${trophy.message}</span> 
      `
  div.classList.add('toast')
  document.getElementById('toasts').appendChild(div)
  setTimeout(() => {
    div.remove()
  }, 6000)

  checkTrophiesInLocalStorage()
}

const collision = (paddle, upBTN, downBTN, gamepadIndex) => {
  const gamepadConnected = navigator.getGamepads()[gamepadIndex] !== null
  const isPressedDown = downBTN || (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[13].pressed)
  const isPressedUp = upBTN || (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[12].pressed)
  const isPressedRight = buttonsPressed.d || (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[15].pressed)
  const withinXRange = ball.x > paddle.x - 5 && ball.x < paddle.x + 15
  const withinYRange = ball.y >= paddle.y - settings.tolerance && ball.y < paddle.y - 1 + paddle.height + settings.tolerance

  if (withinXRange && withinYRange && !paddle.collision) {
    obstacle1.collision = false
    obstacle2.collision = false
    const isRightSide = ball.x > canvas.width / 2
    paddle1.collision = !isRightSide
    paddle2.collision = isRightSide
    ball.directionX = -ball.directionX

    if (paddle1.collision || paddle2.collision) {
      settings.gameSpeedModifier += 1
      if (settings.gameSpeedModifier >= 20 && !trophies.rallies.unlocked) {
        trophies.rallies.unlocked = true
        showTrophyToast(trophies.rallies)
        localStorage.setItem('trophies', JSON.stringify(trophies))
      }
      clearInterval(runGame)
      runGame = settings.isSinglePlayer
          ? setInterval(onePlayerMode, 1000 / (settings.gameSpeed + settings.gameSpeedModifier))
          : setInterval(twoPlayerMode, 1000 / (settings.gameSpeed + settings.gameSpeedModifier))
    }

    if (paddle1.collision) {
      ball.x += isPressedRight ? 5 : 0
      ball.speedX = isPressedRight ? 10 : 5
      animateCollisionP1()
    }

    if (paddle2.collision) {
      ball.x -= buttonsPressed.left ? 5 : 0
      ball.speedX = buttonsPressed.left ? 10 : 5
      animateCollisionP2()
    }

    if (ball.speedY === 0) {
      ball.speedY = 2
    }

    if (isPressedDown && ball.speedY < 0) {
      ball.speedY -= 1
    }

    if (isPressedUp && ball.speedY > 0) {
      ball.speedY += 1
    }
    buttonsPressed.left && paddle2.collision ? playSound(sounds.bounce, 16) : playSound(sounds.bounce, 0.5)
    isPressedRight && paddle1.collision ? playSound(sounds.bounce, 16) : playSound(sounds.bounce, 0.5)
  }
}

const collisionWithObstacle = () => {
  const hasAtLeastOneObstacle = settings.amountObstacles >= 1
  const hasTwoObstacles = settings.amountObstacles >= 2
  if (!hasAtLeastOneObstacle) return
  const withinXRange = ball.x > obstacle1.x - 5 && ball.x < obstacle1.x + 15
  const withinYRange =
      (ball.y >= obstacle1.y - settings.tolerance && ball.y < obstacle1.y - 1 + obstacle1.height + settings.tolerance) ||
      (hasTwoObstacles && ball.y >= obstacle2.y - settings.tolerance && ball.y < obstacle2.y - 1 + obstacle1.height + settings.tolerance)
  const collisionWithObstacle = obstacle1.collision || obstacle2.collision
  if (withinXRange && withinYRange && !collisionWithObstacle) {
    playSound(sounds.bounceWall)
    ball.directionX = -ball.directionX
    obstacle1.collision = true
    obstacle2.collision = true
    paddle1.collision = false
    paddle2.collision = false
  }
}

const animateCollisionP1 = () => {
  paddle1.x -= 6
  setTimeout(() => paddle1.x += 6, 50)
  setTimeout(() => paddle1.x -= 3, 100)
  setTimeout(() => paddle1.x += 3, 150)
  setTimeout(() => paddle1.x -= 1, 200)
  setTimeout(() => paddle1.x += 1, 250)
}

const animateCollisionP2 = () => {
  paddle2.x += 6
  setTimeout(() => paddle2.x -= 6, 50)
  setTimeout(() => paddle2.x += 3, 100)
  setTimeout(() => paddle2.x -= 3, 150)
  setTimeout(() => paddle2.x += 1, 200)
  setTimeout(() => paddle2.x -= 1, 250)
}

const drawObstacles = () => {
  const hasAtLeastOneObstacle = settings.amountObstacles >= 1
  const hasTwoObstacles = settings.amountObstacles >= 2
  if (!hasAtLeastOneObstacle) return

  roundedRect(obstacle1.x , obstacle1.y, obstacle1.width, obstacle1.height, 4, '#ff0000ee')
  if (hasTwoObstacles) roundedRect(obstacle2.x , obstacle2.y, obstacle2.width, obstacle2.height, 4, '#ff0000ee')
  obstacle1.y++
  obstacle2.y++
  if (obstacle1.y > canvas.height + 100) obstacle1.y = -100
  if (obstacle2.y > canvas.height + 100) obstacle2.y = -100
}

const drawEverything = () => {
  roundedRect(0, 0, canvas.width, canvas.height, 8, '#000000')
  roundedRect(2, 2, canvas.width - 4, canvas.height - 4, 4, '#000000')
  canvasContext.fillStyle = 'rgba(255,0,0,0.4)' /*middle line*/
  canvasContext.fillRect(canvas.width / 2, 0, 1, canvas.height)
  if (settings.gameState !== gameStates.gameOver) {
    drawObstacles()
    roundedRect(ball.x, ball.y, 10, 10, 4, 'white') /* paddles + ball */
    roundedRect(paddle1.x, paddle1.y, 10, paddle1.height, 4, paddle1.color + 'dd')
    roundedRect(paddle2.x, paddle2.y, 10, paddle2.height, 4, paddle2.color + 'dd')
  }
  if (settings.gameState === gameStates.gameOver) drawVictoryMessage()
  canvasContext.fillStyle = 'white'
  if (settings.countdownValue > 0) canvasContext.fillText(settings.countdownValue, canvas.width / 2 - 20, canvas.height / 2 - 40)
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

const roundedRect = (x, y, width, height, radius, color) => {
  canvasContext.shadowColor = color
  if (color === '#000000') canvasContext.shadowColor = '#ffffff'
  canvasContext.shadowBlur = 8
  canvasContext.shadowOffsetX = 0
  canvasContext.shadowOffsetY = 0
  canvasContext.beginPath()
  canvasContext.moveTo(x + radius, y)
  canvasContext.lineTo(x + width - radius, y)
  canvasContext.arcTo(x + width, y, x + width, y + radius, radius)
  canvasContext.lineTo(x + width, y + height - radius)
  canvasContext.arcTo(x + width, y + height, x + width - radius, y + height, radius)
  canvasContext.lineTo(x + radius, y + height)
  canvasContext.arcTo(x, y + height, x, y + height - radius, radius)
  canvasContext.lineTo(x, y + radius)
  canvasContext.arcTo(x, y, x + radius, y, radius)
  canvasContext.closePath()
  canvasContext.fillStyle = color
  canvasContext.fill()
  canvasContext.strokeStyle = color
  canvasContext.lineWidth = 2
  canvasContext.stroke()
  canvasContext.shadowColor = '#ffffff'
}

const tileWidth = 20
const tileHeight = 20

const letterG = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0],
  [1, 0, 1, 1, 1],
  [0, 1, 1, 1, 0]
]

const letterO = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0]
]

const letterA = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1]
]

const letterL = [
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1]
]

const exclamationMark = [
  [1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1]
]

const drawLetter = (letter, x, y, opacity) => {
  for (let row = 0; row < letter.length; row++) {
    for (let col = 0; col < letter[0].length; col++) {
      if (letter[row][col] === 1) {
        canvasContext.fillStyle = `rgba(255,255,255,${opacity}`
        canvasContext.fillRect(x + col * tileWidth, y + row * tileHeight, tileWidth, tileHeight)
      }
    }
  }
}