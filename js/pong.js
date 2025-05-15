const canvas = document.getElementById('game-canvas')
const generalButtons = document.getElementById('general-buttons')
const modal = document.getElementById('modal')
const modalTrophies = document.getElementById('modal-trophies')
const trophyImage = document.getElementById('trophy')

const canvasWidth = canvas.width
const canvasHeight = canvas.height

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
  trophyUnlocked: document.getElementById('trophy-unlocked')
}

let runGame

let gamepad2Connected = false

let canvasContext

const trophiesVersionId = 3

let trophies = {
  firstGoal: {
    message: 'Score your first goal',
    unlocked: false,
    id: 'goal-trophy'
  },
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
  powerShot: {
    message: 'perform a powershot',
    unlocked: false,
    id: 'powershot-trophy',
  },
  sliceShot: {
    message: 'perform a sliceshot',
    unlocked: false,
    id: 'sliceshot-trophy',
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
    message: 'win with maximum obstacles',
    unlocked: false,
    id: 'obstacles-trophy',
  },
  multiplayer: {
    message: 'win multiplayer game',
    unlocked: false,
    id: 'multiplayer-trophy',
  },
  zeroGoals: {
    message: 'win without conceding a goal',
    unlocked: false,
    id: 'zero-goals-trophy',
  },
  openSettings: {
    message: 'open the settings',
    unlocked: false,
    id: 'settings-trophy',
  },
  openGithub: {
    message: 'open my github link',
    unlocked: false,
    id: 'github-trophy',
  }
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
  gameSpeed: 90,
  gameSpeedModifier: 0,
  amountObstacles: 0,
  countdownValue: 3,
  tolerance: 20,
  font: '48px retro',
  paddleHeight: parseInt(inputs.paddleSize.value),
  goalAnimationRunning: false,
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
  gamePadIndex: 0,
}

const paddle2 = {
  x: 760,
  y: 250,
  height: settings.paddleHeight,
  score: 0,
  color: '#FFA500',
  collision: false,
  gamePadIndex: 1,
}

const obstacle1 = {
  x: canvasWidth / 2 - 5,
  y: -450,
  width: 10,
  height: 100,
  collision: false,
}

const obstacle2 = {
  x: canvasWidth / 2 - 5,
  y: -750,
  width: 10,
  height: 100,
  collision: false,
}

const obstacle3 = {
  x: canvasWidth / 2 - 5,
  y: -1050,
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

const checkGamePadConnected = () => {
  return typeof navigator !== 'undefined' && typeof navigator.getGamepads === 'function' && navigator.getGamepads()[0] !== null && navigator?.getGamepads?.()[0]?.connected
}

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
  if (checkGamePadConnected()) {
    console.log('gamepad connected')
  }
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
  if (!trophies.openSettings.unlocked) {
    unlockTrophy(trophies.openSettings)
  }
}

const closeSettings = () => {
  playSound(sounds.buttonClick)
  modal.close()
}

const unlockGithubTrophy = () => {
  if (!trophies.openGithub.unlocked) {
    unlockTrophy(trophies.openGithub)
  }
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
  requestAnimationFrame(drawEverything)
  setTimeout(() => playSound(sounds.music), 3000)
  sounds.music.loop = true
  paddle1.y = canvasHeight / 2 - paddle1.height / 2
  paddle2.y = canvasHeight / 2 - paddle2.height / 2
  setCountdown()
  settings.isSinglePlayer = singlePlayer
  canvas.style.display = 'block'
  canvasContext = canvas.getContext('2d')
  canvasContext.shadowBlur = 4
  canvasContext.shadowColor = '#55ffff99'
  runGame = setInterval(gameLoop, 1000 / (settings.gameSpeed + settings.gameSpeedModifier))
  generalButtons.style.display = 'none'
}

const gameLoop = () => {
  setScore()
  checkGameOver()
  moveEverything()
  collision(paddle2, buttonsPressed.up, buttonsPressed.down)
  collision(paddle1, buttonsPressed.w, buttonsPressed.s)
  collisionWithObstacle()
  move1()
  settings.isSinglePlayer ? moveAI() : move2()
}

const moveEverything = () => {
  if (settings.gameState !== gameStates.gameRunning) return
  ball.x = ball.x + ball.speedX * ball.directionX
  ball.y = ball.y + ball.speedY * 2

  if (ball.x >= canvasWidth|| ball.x <= 0) {
    ball.directionX = ball.directionX * -1
  }
  
  const ballHitsBottom = ball.y >= canvasHeight
  const ballHitsTop = ball.y <= 0

  if (ballHitsBottom || ballHitsTop) {
    ball.speedY = -ball.speedY
    playSound(sounds.bounceWall)
  }

  if (ballHitsBottom) ball.y = canvasHeight

  if (ballHitsTop) ball.y = 0
}

const move1 = () => {
  if (checkGamePadConnected()) {
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
  if (paddle1.y > canvasHeight - paddle1.height) {
    paddle1.y = canvasHeight - paddle1.height
  }
  if (buttonsPressed.d && paddle1.x < canvasWidth /2.5) {
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
  if (paddle1.y > canvasHeight - paddle1.height) {
    paddle1.y = canvasHeight - paddle1.height
  }
  if (buttonsPressed.padRight && paddle1.x < canvasWidth / 2.5) {
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
  if (paddle2.y > canvasHeight - paddle2.height) {
    paddle2.y = canvasHeight - paddle2.height
  }
  if (buttonsPressed.up) {
    paddle2.y = paddle2.y - 6;
  }
  if (paddle2.y < 0) {
    paddle2.y = 0
  }
  if (buttonsPressed.right && paddle2.x < canvasWidth - 20) {
    paddle2.x += 5
  }
  if (buttonsPressed.left && paddle2.x > canvasWidth - canvasWidth /2.5) {
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
  if (paddle2.y > canvasHeight - paddle2.height) {
    paddle2.y = canvasHeight - paddle2.height
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
  if (settings.gameState === gameStates.gameOver) {
    settings.goalAnimationRunning = false
    return
  }

  playSound(sounds.goal)

  setTimeout(() => {
    settings.goalAnimationRunning = false
    runGame = setInterval(gameLoop, 1000 / (settings.gameSpeed + settings.gameSpeedModifier))
    settings.gameSpeedModifier = 0
    obstacle1.y = -450
    obstacle2.y = -750
    obstacle3.y = -1050
    animationOpacity = 0
    ball.x = 395
    ball.y = 300
    paddle1.y = canvasHeight / 2 - paddle1.height / 2
    paddle1.x = 30
    paddle2.y = canvasHeight / 2 - paddle2.height / 2
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

const drawScore = () => {
  canvasContext.font = settings.font
  canvasContext.fillStyle = 'white'
  drawCenteredText(paddle1.score, canvasWidth / 4, 60)
  drawCenteredText(paddle2.score, canvasWidth * 3 / 4, 60)
}

const drawCenteredText = (text, x, y) => {
  const textWidth = canvasContext.measureText(text).width
  const centeredX = x - textWidth / 2
  canvasContext.fillText(text, centeredX, y)
}

const drawVictoryMessage = () => {
  const p1Wins = paddle1.score > paddle2.score
  canvasContext.fillStyle = p1Wins ? 'green' : 'red'
  canvasContext.fillRect(0,0,canvasWidth / 2, canvasHeight)
  canvasContext.fillStyle = p1Wins ? 'red' : 'green'
  canvasContext.fillRect(canvasWidth / 2,0,canvasWidth / 2, canvasHeight)
  drawScore()
  trophyImage.classList.remove('trophy-hidden')
  trophyImage.classList.add(p1Wins ? 'trophy-p1' : 'trophy-p2')
  const message1 = p1Wins ? 'Win' : 'Lose'
  const message2 = p1Wins ? 'Lose' : 'Win'
  canvasContext.fillStyle = 'white'
  drawCenteredText(message1, canvasWidth / 4, 350)
  drawCenteredText(message2, canvasWidth * 3 / 4, 350)
}

const playSound = (sound) => {
  sound.play()
}

const setScore = () => {
  if (settings.gameState === gameStates.gameOver) return
  const scoredByP1 = ball.x >= canvasWidth
  const scoredByP2 = ball.x <= 0

  const scored = scoredByP1 || scoredByP2

  if(scored) {
    settings.goalAnimationRunning = true
    resetAfterScore()
    clearInterval(runGame)
    checkGameOver()
  }

  if (scoredByP1) {
    paddle1.score++
    if (!trophies.firstGoal.unlocked) {
      unlockTrophy(trophies.firstGoal)
    }
  }

  if (scoredByP2) {
    paddle2.score++
  }
}

const fadeOutMusic = () => {
  const fadeOutInterval = setInterval(() => {
    if (sounds.music.volume <= 0.2 || sounds.music.playbackRate < 0.5) clearInterval(fadeOutInterval)
    sounds.music.volume -= 0.1
    sounds.music.playbackRate -= 0.1
  }, 100)
}

const checkGameOver = () => {
  if (settings.gameState === gameStates.gameOver) return
  const p1Wins = paddle1.score >= settings.pointsToWin
  const p2Wins = paddle2.score >= settings.pointsToWin
  const gameOver = p1Wins || p2Wins

  if (gameOver) {
    settings.gameState = gameStates.gameOver
    settings.goalAnimationRunning = false
    clearInterval(runGame)
    fadeOutMusic()
    handleAchievedTrophies(p1Wins)
    if (p2Wins && settings.isSinglePlayer) playSound(sounds.lose)
    else playSound(sounds.victory)
    setTimeout(() => document.getElementById('restart-button').style.display = 'block', 2000)
  }
}

const checkTrophiesInLocalStorage = () => {
  const trophiesVersionIdFromStorage = localStorage.getItem('trophies-version-id')
  if (!trophiesVersionIdFromStorage || JSON.parse(trophiesVersionIdFromStorage) !== trophiesVersionId) return

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

  if (p1Wins && !trophies.zeroGoals.unlocked && paddle2.score === 0) {
    trophies.zeroGoals.unlocked = true
    achievedTrophies.push(trophies.zeroGoals)
  }

  if (p1Wins && settings.amountObstacles === parseInt(inputs.obstacles.max) && !trophies.obstacles.unlocked) {
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

  localStorage.setItem('trophies-version-id', JSON.stringify(trophiesVersionId))
  localStorage.setItem('trophies', JSON.stringify(trophies))

  achievedTrophies.forEach((item, index) => {
    setTimeout(() => {
      showTrophyToast(item)
    }, index * 1000)
  })
}

const showTrophyToast = (trophy) => {
  playSound(sounds.trophyUnlocked)
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

const unlockTrophy = (trophy) => {
  trophy.unlocked = true
  localStorage.setItem('trophies-version-id', JSON.stringify(trophiesVersionId))
  localStorage.setItem('trophies', JSON.stringify(trophies))
  showTrophyToast(trophy)
}

const collision = (paddle, upBTN, downBTN) => {
  const gamepadConnected = typeof navigator !== 'undefined' && typeof navigator.getGamepads === 'function'  && navigator.getGamepads()[paddle.gamePadIndex] !== null
  const isPressedDown = downBTN || (gamepadConnected && navigator?.getGamepads?.()[paddle.gamePadIndex]?.buttons?.[13]?.pressed)
  const isPressedUp = upBTN || (gamepadConnected && navigator?.getGamepads?.()[paddle.gamePadIndex]?.buttons?.[12]?.pressed)
  const isPressedRight = buttonsPressed.d || (gamepadConnected && navigator?.getGamepads?.()[paddle.gamePadIndex]?.buttons?.[15]?.pressed)
  const withinXRange = ball.x > paddle.x - 5 && ball.x < paddle.x + 15
  const withinYRange = ball.y >= paddle.y - settings.tolerance && ball.y < paddle.y - 1 + paddle.height + settings.tolerance

  if (withinXRange && withinYRange && !paddle.collision) {
    obstacle1.collision = false
    obstacle2.collision = false
    obstacle3.collision = false
    const isRightSide = ball.x > canvasWidth / 2
    paddle1.collision = !isRightSide
    paddle2.collision = isRightSide
    ball.directionX = -ball.directionX

    if (paddle1.collision || paddle2.collision) {
      settings.gameSpeedModifier += 1
      if (settings.gameSpeedModifier >= 20 && !trophies.rallies.unlocked) {
        unlockTrophy(trophies.rallies)
      }
      if (settings.gameSpeedModifier % 10 === 0) {
        clearInterval(runGame)
        runGame = setInterval(gameLoop, 1000 / (settings.gameSpeed + settings.gameSpeedModifier))
      }
    }

    if (paddle1.collision) {
      ball.x += isPressedRight ? 5 : 0
      ball.speedX = isPressedRight ? 10 : 5
      animateCollisionP1()

      if (!trophies.powerShot.unlocked && isPressedRight) unlockTrophy(trophies.powerShot)
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
      if (!trophies.sliceShot.unlocked) unlockTrophy(trophies.sliceShot)
    }

    if (isPressedUp && ball.speedY > 0) {
      ball.speedY += 1
      if (!trophies.sliceShot.unlocked) unlockTrophy(trophies.sliceShot)
    }
    buttonsPressed.left && paddle2.collision ? playSound(sounds.bounce, 16) : playSound(sounds.bounce, 0.5)
    isPressedRight && paddle1.collision ? playSound(sounds.bounce, 16) : playSound(sounds.bounce, 0.5)
  }
}

const collisionWithObstacle = () => {
  const hasAtLeastOneObstacle = settings.amountObstacles >= 1
  const hasTwoObstacles = settings.amountObstacles >= 2
  const hasThreeObstacles = settings .amountObstacles >= 3
  if (!hasAtLeastOneObstacle) return
  const withinXRange = ball.x > obstacle1.x - 5 && ball.x < obstacle1.x + 15
  const withinYRange =
      (ball.y >= obstacle1.y - settings.tolerance && ball.y < obstacle1.y - 1 + obstacle1.height + settings.tolerance) ||
      (hasTwoObstacles && ball.y >= obstacle2.y - settings.tolerance && ball.y < obstacle2.y - 1 + obstacle1.height + settings.tolerance) ||
      (hasThreeObstacles && ball.y >= obstacle3.y - settings.tolerance && ball.y < obstacle3.y - 1 + obstacle1.height + settings.tolerance)
  const collisionWithObstacle = obstacle1.collision || obstacle2.collision || obstacle3.collision
  if (withinXRange && withinYRange && !collisionWithObstacle) {
    playSound(sounds.bounceWall)
    ball.directionX = -ball.directionX
    obstacle1.collision = true
    obstacle2.collision = true
    obstacle3.collision = true
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

let backgroundOpacity = 0
let textOpacity = 0.5

const drawGoalAnimation = () => {
  canvasContext.fillStyle = `rgba(255,0,0,${backgroundOpacity})`
  canvasContext.fillRect(0, 0, canvasWidth, canvasHeight)
  backgroundOpacity += 0.2
  drawLetter(letterG, 110, canvasHeight / 2 - 40, textOpacity)
  drawLetter(letterO, 230, canvasHeight / 2 - 40, textOpacity)
  drawLetter(letterA, 350, canvasHeight / 2 - 40, textOpacity)
  drawLetter(letterL, 470, canvasHeight / 2 - 40, textOpacity)
  drawLetter(exclamationMark, 580, canvasHeight / 2 - 40, textOpacity)
  textOpacity === 0.5 ? textOpacity = 1 : textOpacity = 0.5
}

const drawObstacles = () => {
  const hasAtLeastOneObstacle = settings.amountObstacles >= 1
  const hasTwoObstacles = settings.amountObstacles >= 2
  const hasThreeObstacles = settings.amountObstacles >= 3
  if (!hasAtLeastOneObstacle) return

  roundedRect(obstacle1.x , obstacle1.y, obstacle1.width, obstacle1.height, 4, '#ff0000ee')
  if (hasTwoObstacles) roundedRect(obstacle2.x , obstacle2.y, obstacle2.width, obstacle2.height, 4, '#ff0000ee')
  if (hasThreeObstacles) roundedRect(obstacle3.x , obstacle3.y, obstacle3.width, obstacle3.height, 4, '#ff0000ee')
  obstacle1.y++
  obstacle2.y++
  obstacle3.y++
  if (obstacle1.y > canvasHeight + 100) obstacle1.y = -200
  if (obstacle2.y > canvasHeight + 100) obstacle2.y = -200
  if (obstacle3.y > canvasHeight + 100) obstacle3.y = -200
}

const drawPlayingField = () => {
  roundedRect(2, 2, canvasWidth - 4, canvasHeight - 4, 4, '#000000')
  canvasContext.fillStyle = 'rgba(255,0,0,0.4)' /*middle line*/
  canvasContext.fillRect(canvasWidth / 2, 0, 1, canvasHeight)
}

const drawBallsAndPaddles = () => {
  roundedRect(ball.x, ball.y, 10, 10, 4, 'white') /* paddles + ball */
  roundedRect(paddle1.x, paddle1.y, 10, paddle1.height, 4, paddle1.color + 'dd')
  roundedRect(paddle2.x, paddle2.y, 10, paddle2.height, 4, paddle2.color + 'dd')
}

const drawCountDown = () => {
  canvasContext.fillStyle = 'white'
  if (settings.countdownValue > 0) {
    canvasContext.fillText(settings.countdownValue, canvasWidth / 2 - 20, canvasHeight / 2 - 40)
  }
}

const drawEverything = () => {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)

  if (!settings.goalAnimationRunning) {
    drawPlayingField()
    if (settings.gameState !== gameStates.gameOver) {
      drawObstacles()
      drawBallsAndPaddles()
    }

    drawCountDown()
    backgroundOpacity = 0
    textOpacity = 0.5
  }

  drawScore()

  if (settings.gameState === gameStates.gameOver) drawVictoryMessage()

  if (settings.goalAnimationRunning && settings.gameState !== gameStates.gameOver) {
      drawGoalAnimation()
  }

  requestAnimationFrame(drawEverything)
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

  canvasContext.fillStyle = color
  canvasContext.strokeStyle = color
  canvasContext.lineWidth = 2

  canvasContext.beginPath()
  canvasContext.roundRect(x, y, width, height, radius)
  canvasContext.fill()
  canvasContext.stroke()
  canvasContext.closePath()

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