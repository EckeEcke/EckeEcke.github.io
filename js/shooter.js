// _______________________________________________________________
// HTML ELEMENTS

const canvas = document.getElementById('game-canvas')
const canvasContext = canvas.getContext('2d')
const nameInput = document.getElementById('name-input')
canvasContext.font = '24px retro'

// _______________________________________________________________
// IMAGES

const imageSources = {
  playerShip: './images/shooter/spaceship.png',
  snakeHead: './images/shooter/snake-head.png',
  snakeBody: './images/shooter/snake.png',
  enemyShip: './images/shooter/enemyship.png',
  asteroid: './images/shooter/asteroid.png',
  explosion: './images/shooter/explosion.png',
  trumpHead: './images/shooter/trumphead.png',
  background: './images/shooter/space-pixel-background.jpg'
}

const images = {
  playerShip: new Image(),
  snakeHead: new Image(),
  snakeBody: new Image(),
  enemyShip: new Image(),
  asteroid: new Image(),
  explosion: new Image(),
  trumpHead: new Image(),
  background: new Image(),
}

function loadImages() {
  images.snakeHead.src = imageSources.snakeHead
  images.snakeBody.src = imageSources.snakeBody
  images.enemyShip.src = imageSources.enemyShip
  images.trumpHead.src = imageSources.trumpHead
  images.background.src = imageSources.background
  images.playerShip.src = imageSources.playerShip
  images.explosion.src = imageSources.explosion
}

// _______________________________________________________________
// SOUNDS

const soundSources = {
  laserEnemy: './sounds/shooter/laser-enemy.wav',
  laser: './sounds/shooter/laser.wav',
  laser2: './sounds/shooter/laser2.wav',
  laser3: './sounds/shooter/laser3.wav',
  powerup: './sounds/shooter/shooter-powerup.wav',
  alertSound: './sounds/shooter/alert.wav',
  hitSound: './sounds/shooter/hit.wav',
  spaceshipSound: './sounds/shooter/spaceship-rising.wav',
  loseSound: './sounds/shooter/lose-shooter.wav',
  gameMusic: './sounds/shooter/spaceshooter-music.mp3',
}

const sounds = {
  laserEnemy: undefined,
  laser: undefined,
  laser2: undefined,
  laser3: undefined,
  powerup: undefined,
  alertSound: undefined,
  hitSound: undefined,
  spaceshipSound: undefined,
  loseSound: undefined,
  gameMusic: undefined,
}

function loadSounds() {
  sounds.laserEnemy = new Audio(soundSources.laserEnemy)
  sounds.laser = new Audio(soundSources.laser)
  sounds.laser.onloadeddata = () => gameState.gameLoaded += 10
  sounds.laser2 = new Audio(soundSources.laser2)
  sounds.laser2.onloadeddata = () => gameState.gameLoaded += 10
  sounds.laser3 = new Audio(soundSources.laser3)
  sounds.laser3.onloadeddata = () => gameState.gameLoaded += 10
  sounds.powerup = new Audio(soundSources.powerup)
  sounds.powerup.onloadeddata = () => gameState.gameLoaded += 10
  sounds.alertSound = new Audio(soundSources.alertSound)
  sounds.alertSound.onloadeddata = () => gameState.gameLoaded += 10
  sounds.hitSound = new Audio(soundSources.hitSound)
  sounds.hitSound.onloadeddata = () => gameState.gameLoaded += 10
  sounds.spaceshipSound = new Audio(soundSources.spaceshipSound)
  sounds.spaceshipSound.onloadeddata = () => gameState.gameLoaded += 10
  sounds.loseSound = new Audio(soundSources.loseSound)
  sounds.loseSound.onloadeddata = () => gameState.gameLoaded += 10
  sounds.gameMusic = new Audio(soundSources.gameMusic)
  sounds.gameMusic.onloadeddata = () => gameState.gameLoaded += 10
  sounds.gameMusic.loop = true
}

// _______________________________________________________________
// GAME DATA

const gameStates = {
  titleScreen: 'displaying title screen',
  spaceshipAnimation: 'running spaceship animation',
  asteroidsRound: 'runs asteroids level',
  enemyShipRound: 'runs enemy ship level',
  snakeRound: 'runs snake level',
  gameOver: 'game is over',
}

const rounds = {
  asteroids: 'asteroid level',
  enemyShips: 'enemy ships level',
  snake: 'snake level',
}

const gameState = {
  state: gameStates.titleScreen,
  round: rounds.snake,
  score: 0,
  highScore: 'LOADING...',
  isHighScore: false,
  highScores: null,
  highScoresLoaded: false,
  highScoresLoading: false,
  loadingAnimation: '.',
  timer: 0,
  multiplier: 0,
  bonusScore: 0,
  streak: 0,
  gameSpeed: 60,
  enemyShipCount: 0,
  enemiesRequired: 8,
  musicRunning: false,
  backgroundScrollPosition: -300,
  gameLoaded: 0,
  displayedScreen: 'controls',
  volume: 1,
}

const buttonsPressed = {
  a: false,
  d: false,
  w: false,
  s: false,
}

const touchControls = {
  x: null,
  active: false,
}

const spaceship = {
  x: 150,
  y: 580,
  width: 80,
  height: 100,
  canon: {
    y: 520,
    x: 200,
  },
  shot: {
    x: null,
    y: null,
    width: 10,
    height: 20,
    shotFired: false,
  },
  playerKilled: false,
  hitSomething: false,
}

asteroidImage = new Image()
asteroidImage.src = imageSources.asteroid
asteroidImage2 = new Image()
asteroidImage2.src = imageSources.asteroid
asteroidImage3 = new Image()
asteroidImage3.src = imageSources.asteroid
asteroidImage4 = new Image()
asteroidImage4.src = imageSources.asteroid
asteroidImage5 = new Image()
asteroidImage5.src = imageSources.asteroid
asteroidImage6 = new Image()
asteroidImage6.src = imageSources.asteroid

const asteroids = [
  {
    x: 100,
    y: -50,
    width: 30,
    height: 30,
    hit: false,
    image: asteroidImage,
    countBlocker: false,
    speed: 2,
  },
  {
    x: 200,
    y: -100,
    width: 40,
    height: 40,
    hit: false,
    image: asteroidImage2,
    countBlocker: false,
    speed: 2.4,
  },
  {
    x: 300,
    y: -200,
    width: 60,
    height: 60,
    hit: false,
    image: asteroidImage3,
    countBlocker: false,
    speed: 1.6,
  },
  {
    x: 150,
    y: -300,
    width: 80,
    height: 80,
    hit: false,
    image: asteroidImage4,
    countBlocker: false,
    speed: 2.4,
  },
  {
    x: 250,
    y: -350,
    width: 80,
    height: 80,
    hit: false,
    image: asteroidImage5,
    countBlocker: false,
    speed: 2.8,
  },
  {
    x: 50,
    y: -150,
    width: 30,
    height: 30,
    hit: false,
    image: asteroidImage6,
    countBlocker: false,
    speed: 3.6,
  }
]

const enemyShip1 = {
  x: 0,
  y: 60,
  width: 50,
  height: 50,
  speed: 4,
  lives: 1,
  shotFired: false,
  shotSpeed: 5,
  shotX: 0,
  shotX2: 0,
  shotY: 0,
  shotWidth: 10,
  shotHeight: 20,
}

const enemyShip2 = {
  x: 260,
  y: 120,
  width: 50,
  height: 50,
  speed: -4,
  lives: 1,
  shotFired: false,
  shotSpeed: 5,
  shotX: 0,
  shotX2: 0,
  shotY: 0,
  shotWidth: 10,
  shotHeight: 20,
}

const snake = {
  elements: [],
  elementWidth: 40,
  elementHeight: 40,
  lives: 8,
  color: 0,
}

const intervals = {
  game: null,
  enemies: null,
  background: null,
  listenForStart: null,
}

function startGame() {
  sounds.spaceshipSound.play()
  gameState.state = gameStates.spaceshipAnimation
}

// _______________________________________________________________
// GAME LOGIC

function runGame() {
  moveShip()
  moveShipTouch()
  shoot()
  setScore()
  gameOver()
}

function runEnemies() {
  if (gameState.round === rounds.snake) {
    moveSnake()
    hitDetectionSnake()
  }
  if (gameState.round === rounds.asteroids) {
    moveAsteroids()
    hitDetectionAsteroids()
  }
  if (gameState.round === rounds.enemyShips) {
    moveShipEnemies()
  }
}

function setScore() {
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score
    gameState.isHighScore = true
  }

  gameState.multiplier = Math.floor(gameState.streak / 10) + 1 <= 3 ? Math.floor(gameState.streak / 10) + 1 : 3
}

function shoot() {
  const gamepadConnected = navigator.getGamepads()[0] !== null

  if (!spaceship.shot.shotFired && (buttonsPressed.w || (gamepadConnected && navigator.getGamepads()[0].buttons[0].pressed))) {
    spaceship.shot.shotFired = true
    spaceship.shot.x = spaceship.canon.x - spaceship.shot.width / 2
    spaceship.shot.y = spaceship.canon.y
    switch (gameState.multiplier) {
      case 2: {
        sounds.laser2.play()
        break
      }
      case 3: {
        sounds.laser3.play()
        break
      }
      default: {
        sounds.laser.play()
      }
    }
  }

  if (touchControls.active && !spaceship.shot.shotFired) {
    window.navigator.vibrate(100)
    spaceship.shot.shotFired = true
    spaceship.shot.x = spaceship.canon.x - spaceship.shot.width / 2
    spaceship.shot.y = spaceship.canon.y
    sounds.laser.play()
  }

  moveShot()
}

function resetAsteroids() {
  asteroids.forEach(roid => {
    if (roid.y > 0) roid.y = -50
  })
}

function gameOver() {
  if (gameState.round === rounds.asteroids && Math.floor(gameState.backgroundScrollPosition / 10) + 30 <= 0) {
    handleGameover()
  }
  if (gameState.round === rounds.snake && snake.elements[2].y >= 450) {
    handleGameover()
  }
}

function endLevel() {
  clearInterval(intervals.enemies)
  clearInterval(intervals.game)
  clearInterval(intervals.background)
  gameState.state = gameStates.spaceshipAnimation
  sounds.spaceshipSound.play()
  snake.color += 20
  gameState.gameSpeed += 2
  canvasContext.fillStyle = 'limegreen'
  canvasContext.fillText('Next round!', 100, canvas.height / 2)
}

function startNextRound() {
  resetGame()
  if (!gameState.musicRunning) {
    sounds.gameMusic.play()
    gameState.musicRunning = true
  }
  switch (gameState.round) {
    case rounds.snake:
      resetAsteroids()
      gameState.round = rounds.asteroids
      gameState.state = gameStates.asteroidsRound
      break
    case rounds.enemyShips:
      gameState.round = rounds.snake
      gameState.state = gameStates.snakeRound
      break
    case rounds.asteroids:
      gameState.round = rounds.enemyShips
      gameState.state = gameStates.enemyShipRound
      break
  }
  intervals.game = setInterval(runGame, 1000 / 140)
  intervals.enemies = setInterval(runEnemies, 1000 / gameState.gameSpeed)
  intervals.background = setInterval(moveBackground, 1000 / 30)
}

function handleGameover() {
  spaceship.playerKilled = true
  window.navigator.vibrate(1000)
  gameState.round = rounds.asteroids
  clearInterval(intervals.enemies)
  clearInterval(intervals.game)
  clearInterval(intervals.background)
  gameState.backgroundScrollPosition = -300
  gameState.enemiesRequired = 6
  sounds.gameMusic.playbackRate = 0.5
  gameState.musicRunning  = false
  setTimeout(() => {
    sounds.gameMusic.pause()
    sounds.gameMusic.currentTime = 0
    sounds.gameMusic.playbackRate = 1
  }, 1000)
  gameState.streak = 0
  sounds.loseSound.play()
  setTimeout(() => {
    gameState.state = gameStates.gameOver
    gameState.isHighScore = false
    gameState.gameSpeed = 60
  }, 2000)
}

function resetGame() {
  snake.elements = [{
    x: 0,
    y: 0,
    speed: 8,
    lives: 1,
    image: images.snakeHead,
  },
    {
      x: 40,
      y: 0,
      speed: 8,
      lives: 2,
      image: images.snakeBody
    },
    {
      x: 80,
      y: 0,
      speed: 8,
      lives: 3,
      image: images.snakeBody
    },
    {
      x: 120,
      y: 0,
      speed: 8,
      lives: 4,
      image: images.snakeBody
    },
    {
      x: 160,
      y: 0,
      speed: 8,
      lives: 5,
      image: images.snakeBody
    },
    {
      x: 200,
      y: 0,
      speed: 8,
      lives: 6,
      image: images.snakeBody
    },
    {
      x: 240,
      y: 0,
      speed: 8,
      lives: 7,
      image: images.snakeBody
    },
    {
      x: 280,
      y: 0,
      speed: 8,
      lives: 8,
      image: images.snakeBody
    }]

  asteroids[0].y = -50
  asteroids[1].y = -100
  asteroids[2].y = -200
  asteroids[3].y = -300
  spaceship.x = 150
  spaceship.canon.y = 520
  spaceship.canon.x = spaceship.x + 40
  spaceship.shot.x = spaceship.canon.x - spaceship.shot.width / 2
  spaceship.shot.y = canvas.height
  spaceship.playerKilled = false
  spaceship.y = 580
  enemyShip1.lives = 2
  enemyShip2.lives = 2
  enemyShip1.shotY = enemyShip1.y
  enemyShip2.shotY = enemyShip2.y
  snake.lives = 8
  buttonsPressed.a = false
  buttonsPressed.d = false
  buttonsPressed.w = false
  spaceship.shot.shotFired = false
  gameState.backgroundScrollPosition = -220
  gameState.enemyshipCount = 0
  gameState.bonusScore = 0
}

function moveEnemyShip(obj) {
  obj.x += obj.speed
  if (obj.x <= 0 || obj.x >= canvas.width - 40) {
    obj.speed = obj.speed * (-1)
  }
}

function moveEnemyShots(obj, target) {
  if (obj.x + 20 >= target && obj.x <= target + 20 && obj.shotFired === false && obj.lives >= 1) {
    obj.shotX = obj.x
    obj.shotX2 = obj.x + 30
    obj.shotY = obj.y
    obj.shotFired = true

    sounds.laserEnemy.play()
  }
  if (obj.shotFired) {
    obj.shotY += obj.shotSpeed
  }
  if (obj.shotY > canvas.height) {
    obj.shotFired = false
  }
  const hitByEnemyShot = spaceship.y < obj.shotY + 30 && spaceship.y + 10 > obj.shotY && spaceship.x + 10 < obj.shotX + 30 && spaceship.x + 80 > obj.shotX + 20 && obj.lives >= 1
  if (hitByEnemyShot) {
    handleGameover()
  }
}

function moveShipEnemies() {
  moveEnemyShip(enemyShip1)
  moveEnemyShots(enemyShip1, spaceship.x)
  hitDetectionShip(enemyShip1)
  moveEnemyShip(enemyShip2)
  moveEnemyShots(enemyShip2, spaceship.x)
  hitDetectionShip(enemyShip2)
  if (enemyShip1.lives <= 0 && enemyShip2.lives <= 0) {
    enemyShip1.shotFired = false
    enemyShip2.shotFired = false
    enemyShip1.speed *= 1.1
    enemyShip2.speed *= 1.1
    endLevel()
  }
}

function moveAsteroids() {
  asteroids.forEach(roid => {
    if(roid.hit) return
    moveAsteroid(roid)
  })
}

function moveShot() {
  if (spaceship.shot.shotFired) spaceship.shot.y -= 5

  if (spaceship.shot.y <= -20) {
    spaceship.shot.shotFired = false
    gameState.streak = 0
  }
}

function moveBackground() {
  if (gameState.backgroundScrollPosition < 140) {
    gameState.backgroundScrollPosition += 0.8
  }
}

function moveShip() {
  let gamepadConnected = navigator.getGamepads()[0] !== null
  if (buttonsPressed.a || (gamepadConnected && navigator.getGamepads()[0].buttons[14].pressed )) {
    spaceship.x -= 4
    spaceship.canon.x -= 4
  }
  if (spaceship.x < -20) {
    spaceship.x = -20
    spaceship.canon.x = 20
  }

  if (buttonsPressed.d || (gamepadConnected && navigator.getGamepads()[0].buttons[15].pressed )) {
    spaceship.x += 4
    spaceship.canon.x += 4
  }

  if (spaceship.x > 340) {
    spaceship.x = 340
    spaceship.canon.x = 380
  }
}

function moveShipTouch() {
  if (touchControls.active) {
    if (spaceship.x > touchControls.x) {
      spaceship.x -= 4
      spaceship.canon.x -= 4
    }

    if (spaceship.x < touchControls.x) {
      spaceship.x += 4
      spaceship.canon.x += 4
    }
  }
}

function moveElement(obj) {
  obj.x -= obj.speed
  if (obj.x < -50 || obj.x > 400) {
    obj.y += 40
    obj.speed = obj.speed * (-1)
  }
}

function moveSnake() {
  snake.elements.forEach(element => moveElement(element))
}

function moveAsteroid(obj) {
  if (gameState.score < 400) {
    obj.y += obj.speed
  } else if (gameState.score < 800) {
    obj.y += obj.speed + 0.2
  } else if (gameState.score < 1200) {
    obj.y += obj.speed + 0.6
  } else {
    obj.y += obj.speed + 1
  }
  if (obj.y > canvas.height) {
    obj.y = -100
  }
}

function hitDetectionAsteroids() {
  asteroids.forEach(roid => hitDetectionSingle(roid))
}

function hitDetectionSnake() {

  spaceship.hitSomething = false

  snake.elements.forEach(element => hitDetection(element))

  if (spaceship.hitSomething) {
    snake.color += 50
    spaceship.shot.shotFired = false
    snake.lives -= 0.5
    setTimeout(() => snake.lives -= 0.5, 100)
    gameState.score += 10 * gameState.multiplier
    gameState.streak += 1

    if (gameState.streak % 10 === 0) {
      sounds.powerup.play()
    }
    spaceship.shot.shotFired = false
    spaceship.shot.y = 600
    setTimeout(() => { snake.color -= 50 }, 50)
    sounds.hitSound.pause()
    sounds.hitSound.currentTime = 0
    sounds.hitSound.play()
  }


  if (snake.lives === 0) {
    endLevel()
  }
}

function hitDetection(obj) {
  if (spaceship.shot.y <= obj.y + 40 && spaceship.shot.y >= obj.y &&
      spaceship.shot.x >= obj.x && spaceship.shot.x + spaceship.shot.width <= obj.x + 40 &&
      snake.lives >= obj.lives) {
    spaceship.hitSomething = true
  }
}

function hitDetectionShip(obj) {
  if (obj.lives <= 0) return

  if (spaceship.shot.y <= obj.y + 40 && spaceship.shot.y >= obj.y && spaceship.shot.x >= obj.x &&
      spaceship.shot.x + spaceship.shot.width <= obj.x + 50 &&
      obj.lives >= 1 && spaceship.shot.shotFired) {
    obj.lives -= 0.5
    sounds.hitSound.play()
    setTimeout(() => obj.lives -= 0.5, 100)
    spaceship.shot.shotFired = false
    spaceship.shot.y = 600
    gameState.score += 30 * gameState.multiplier
    gameState.streak += 1
  }
}

function hitDetectionSingle(obj) {
  if (spaceship.y < obj.y + obj.height && spaceship.y + 100 > obj.y && spaceship.x + 10 < obj.x + obj.width &&
      spaceship.x + 80 > obj.x + obj.width) {
    handleGameover()
    return
  }
  if (spaceship.shot.y <= obj.y + obj.height && spaceship.shot.y >= obj.y &&
      spaceship.shot.x >= obj.x - 10 && spaceship.shot.x + spaceship.shot.width <= obj.x + obj.width) {
    if (!obj.countBlocker) {
      sounds.hitSound.pause()
      sounds.hitSound.currentTime = 0
      sounds.hitSound.play()
      gameState.enemyshipCount += 1
      gameState.score += 5 * gameState.multiplier
      gameState.streak += 1

      if (gameState.streak % 10 === 0) {
        sounds.powerup.play()
      }
    }
    obj.countBlocker = true
    obj.image.src = imageSources.explosion
    spaceship.shot.shotFired = false
    spaceship.shot.y = 600

    const maxAsteroidY = 350
    const minAsteroidY = 20
    const maxAsteroidX = 350
    const minAsteroidX = 20
    setTimeout(() => {
      obj.hit = true
      obj.countBlocker = false
      obj.image.src = imageSources.asteroid
      obj.y = -(Math.random() * (maxAsteroidY - minAsteroidY)) + minAsteroidY
      obj.x = (Math.random() * (maxAsteroidX - minAsteroidX)) + minAsteroidX
    }, 100)
    setTimeout(() => obj.hit = false, 2000)

  }
  if (gameState.enemyshipCount === gameState.enemiesRequired) {
    gameState.bonusScore = (Math.floor((140 - gameState.backgroundScrollPosition) / 4)) * gameState.multiplier
    gameState.score += gameState.bonusScore
    gameState.enemyshipCount = 0
    gameState.enemiesRequired += 2
    endLevel()
  }
}

// _______________________________________________________________
// CONTROLS

function changeTouchPosition(event) {
  touchControls.active = true
  touchControls.x = event.targetTouches ? event.targetTouches[0].pageX - canvas.offsetLeft : event.offsetX
  if (!buttonsPressed.s) {
    buttonsPressed.s = true
    gameState.score = 0
    startGame()
  }
}

function keyDownHandler(event) {
  if (event.key === 'a' || event.key === 'ArrowLeft') {
    buttonsPressed.a = true
  }
  else if (event.key === 'd' || event.key === 'ArrowRight') {
    buttonsPressed.d = true
  }
  else if (event.key === 'w' || event.key === 'ArrowUp') {
    buttonsPressed.w = true
  }
}

function keyUpHandler(event) {
  if (event.key === 'a' || event.key === 'ArrowLeft') {
    buttonsPressed.a = false
  }
  else if (event.key === 'd' || event.key === 'ArrowRight') {
    buttonsPressed.d = false
  }
  else if (event.key === 'w' || event.key === 'ArrowUp') {
    buttonsPressed.w = false
  }
}

// _______________________________________________________________
// DRAW GRAPHICS

function drawSpaceshipAnimation() {
  canvasContext.fillStyle = 'black'
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  canvasContext.drawImage(images.background, 0, gameState.backgroundScrollPosition)
  canvasContext.fillStyle = 'limegreen'
  canvasContext.textAlign = 'center'
  canvasContext.fillText(gameState.score === 0 ? 'Save earth!' : 'Next round!', canvas.width / 2, canvas.height / 2)
  canvasContext.fillText(gameState.bonusScore > 0 ? `Bonus Score: ${gameState.bonusScore}` : '', canvas.width / 2, canvas.height / 2 + 50)
  canvasContext.drawImage(images.playerShip, spaceship.x, spaceship.y - 60, spaceship.width, spaceship.height)
  spaceship.y -= 5
  if (gameState.backgroundScrollPosition < 80) gameState.backgroundScrollPosition += 1.2
  if (spaceship.y < -50) {
      startNextRound()
  }
}

function drawEverything() {
  canvasContext.fillStyle = 'black'
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  canvasContext.drawImage(images.background, 0, gameState.backgroundScrollPosition)
  drawShipAndShot()
  drawScore()

  if (gameState.state === gameStates.titleScreen) {
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.textAlign = 'center'
    canvasContext.fillStyle = 'limegreen'
    drawStartScreen()
  }

  if (gameState.state === gameStates.spaceshipAnimation) {
    drawSpaceshipAnimation()
  }

  if (gameState.state === gameStates.asteroidsRound) {
    drawAsteroids()
  }

  if (gameState.state === gameStates.enemyShipRound) {
    drawEnemyShip(enemyShip1)
    drawEnemyShip(enemyShip2)
    drawEnemyShot(enemyShip1)
    drawEnemyShot(enemyShip2)
  }

  if (gameState.state === gameStates.snakeRound) {
    drawSnake()
  }

  if (gameState.state === gameStates.gameOver) {
    drawGameOverScreen()
  }

  requestAnimationFrame(drawEverything)
}

function drawScore() {
  canvasContext.textAlign = 'start'
  canvasContext.fillStyle = 'limegreen'
  canvasContext.fillText('Score', 12, 30)
  canvasContext.fillText('Hi-Score', 25 + canvas.width / 2, 30)
  canvasContext.fillStyle = 'white'
  canvasContext.fillText(gameState.score, 12, 60)
  canvasContext.fillText(gameState.highScore, 25 + canvas.width / 2, 60)
}

function drawGameOverScreen() {
  canvasContext.fillStyle = 'black'
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  canvasContext.fillStyle = 'limegreen'
  canvasContext.textAlign = 'center'
  canvasContext.fillText('Game over', canvas.width / 2, canvas.height / 2 - 100)
  canvasContext.fillText('Score: ' + gameState.score, canvas.width / 2, canvas.height / 2 - 50)
  nameInput.style.display = 'block'
  nameInput.focus()
  if (gameState.isHighScore) {
    canvasContext.fillText('New Highscore', canvas.width / 2, 100)
  }
}

function drawShipAndShot() {
  let fillColor
  switch (gameState.multiplier) {
    case 2: fillColor = 'red'; break
    case 3: fillColor = 'blue'; break
    default: fillColor = 'limegreen'
  }

  canvasContext.fillStyle = fillColor
  canvasContext.drawImage(spaceship.playerKilled ? images.explosion : images.playerShip, spaceship.x, spaceship.y - 60, spaceship.width, spaceship.height)
  canvasContext.fillRect(spaceship.shot.x, spaceship.shot.y, spaceship.shot.width, spaceship.shot.height)
  canvasContext.fillStyle = 'limegreen'
}

function drawStartScreen() {
  gameState.timer += 1
  if (!gameState.highScoresLoaded && !gameState.highScoresLoading) {
    gameState.highScoresLoading = true
    fetch('https://shooter-backend-vercel.vercel.app/api/getHighscores')
        .then(response => response.json())
        .then(data => gameState.highScores = data)
        .then(() => {
          gameState.highScore = gameState.highScores[0]?.Score || 1000
          gameState.highScoresLoaded = true
          gameState.highScoresLoading = false
        })
        .catch(() => gameState.highScoresLoading = false)
  }
  if (gameState.timer % 500 === 0 && gameState.highScoresLoaded) {
    gameState.timer = 0
    if (gameState.displayedScreen === 'controls') {
      gameState.displayedScreen.displayedScreen = 'manual'
      return
    }
    if (gameState.displayedScreen.displayedScreen === 'manual') {
      gameState.displayedScreen = 'highscores'
      return
    }
    else gameState.displayedScreen = 'controls'
  }
  if (gameState.displayedScreen === 'controls') {
    drawControlsScreen()
  }

  if (gameState.displayedScreen === 'highscores') {
    drawHighscores()
  }

  if (gameState.displayedScreen === 'manual') {
    drawManual()
  }
}

function drawControlsScreen() {
  canvasContext.fillText(gameState.gameLoaded < 100 ? `Loading: ${gameState.gameLoaded}%` : 'Press S to start', canvas.width / 2, canvas.height / 3)
  canvasContext.fillText(gameState.gameLoaded < 100 ? gameState.loadingAnimation : '', canvas.width / 2, canvas.height / 3 + 50)
  canvasContext.fillText('Controls', canvas.width / 2, canvas.height / 2 + 50)
  canvasContext.fillText('Left: A', canvas.width / 2, canvas.height / 2 + 100)
  canvasContext.fillText('Right: D', canvas.width / 2, canvas.height / 2 + 150)
  canvasContext.fillText('Shoot: W', canvas.width / 2, canvas.height / 2 + 200)

  if (gameState.loadingAnimation.length < 3) gameState.loadingAnimation += '.'
  if (gameState.loadingAnimation.length >= 3) gameState.loadingAnimation = ''
}

function drawHighscores() {
  canvasContext.fillText('Highscores', canvas.width / 2, 70)

  if (!gameState.highScores || gameState.highScores.length <= 1) {
    canvasContext.textAlign = 'left'
    canvasContext.fillText('Loading...', 20, 50 + 140)
  }
  else for (let i = 0; i < 8; i++) {
    canvasContext.textAlign = 'left'
    canvasContext.fillText(i + 1 + ' ' + gameState.highScores[i].Player, 20, i * 50 + 140)
    canvasContext.textAlign = 'right'
    canvasContext.fillText(gameState.highScores[i].Score, canvas.width - 20, i * 50 + 140)
  }
}

function drawManual() {
  canvasContext.fillText('Points', canvas.width / 2, 70)
  canvasContext.textAlign = 'left'
  canvasContext.fillText('GREEN Shot ', 20, 140)
  canvasContext.fillText('RED Shot ', 20, 220)
  canvasContext.fillText('BLUE Shot ', 20, 300)
  canvasContext.drawImage(asteroidImage, 30, 350, 50, 50)
  canvasContext.drawImage(images.enemyShip, 30, 430, 50, 50)
  canvasContext.drawImage(images.snakeHead, 30, 505, 50, 50)
  canvasContext.textAlign = 'right'
  canvasContext.fillText('1x PTS', canvas.width - 20, 140)
  canvasContext.fillText('2x PTS', canvas.width - 20, 220)
  canvasContext.fillText('3x PTS', canvas.width - 20, 300)
  canvasContext.fillText('5 PTS', canvas.width - 20, 380)
  canvasContext.fillText('30 PTS', canvas.width - 20, 460)
  canvasContext.fillText('10 PTS', canvas.width - 20, 540)
}

function drawAsteroids() {
  canvasContext.textAlign = 'center'
  canvasContext.fillStyle = 'white'
  canvasContext.fillText(`${gameState.enemyshipCount}/${gameState.enemiesRequired}`, canvas.width / 2, canvas.height / 2 + 100)
  asteroids.forEach(roid => {
    if(roid.hit) return
    canvasContext.drawImage(roid.image, roid.x, roid.y, roid.width, roid.height)
  })
}

function drawEnemyShip(obj) {
  if (obj.lives > 0) {
    canvasContext.drawImage(images.enemyShip, obj.x, obj.y, obj.width, obj.height)
  }
  if (obj.lives % 1 !== 0) {
    canvasContext.drawImage(images.explosion, obj.x, obj.y, obj.width, obj.height)
  }
}

function drawEnemyShot(obj) {
  if (obj.shotFired) {
    canvasContext.fillStyle = 'red'
    canvasContext.fillRect(obj.shotX, obj.shotY, obj.shotWidth, obj.shotHeight)
    canvasContext.fillRect(obj.shotX2, obj.shotY, obj.shotWidth, obj.shotHeight)
  }
}

function drawSnake() {
  canvasContext.filter = `hue-rotate(${snake.color}deg)`
  snake.elements.forEach((element, index) => {
    drawSnakeElement(index+1, element.x, element.y, element.image)
  })
  canvasContext.filter = 'none'
}

function drawSnakeElement(lives, x, y, element) {
  if (snake.lives >= lives) {
    canvasContext.drawImage(gameState.score >= 1000 ? images.trumpHead : element, x, y, snake.elementWidth, snake.elementHeight)
  }
  if (snake.lives === lives - 0.5) {
    canvasContext.drawImage(images.explosion, x, y, snake.elementWidth, snake.elementHeight)
  }
}

function setVolume(value) {
  gameState.volume = value === 0 ? 0 : value * 2 / 10
  const volumeElements = Array.from(document.getElementsByClassName('volume-item'))
  volumeElements.forEach(element => {
    element.innerHTML = element.dataset.value > value ? '&#9645;' : '&#11036;'
  })
  for (let key in sounds) {
    if (sounds[key] instanceof Audio) {
      sounds[key].volume = gameState.volume
    }
  }
}

// _______________________________________________________________
// INITIALIZE GAME

window.onload = () => {
  if (!gameState.highScoresLoaded) {
    fetch('https://shooter-backend-vercel.vercel.app/api/getHighscores')
        .then(response => response.json())
        .then(data => gameState.highScores = data)
        .then(() => {
          gameState.highScore = gameState.highScores[0].Score
          gameState.highScoresLoaded = true
          gameState.gameLoaded += 10
        })
  }

  loadImages()
  loadSounds()
  requestAnimationFrame(drawEverything)
  canvas.addEventListener('touchstart', changeTouchPosition, false)
  canvas.addEventListener('touchmove', changeTouchPosition, false)
  canvas.addEventListener('touchend', function () { touchControls.active = false })
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)
  document.addEventListener('keydown', event => {
    if (event.key === 's' && !buttonsPressed.s && gameState.gameLoaded >= 100 && gameState.highScoresLoaded) {
      gameState.score = 0
      startGame()
      gameState.state = gameStates.spaceshipAnimation
      buttonsPressed.s = true
    }
  })

  intervals.listenForStart = setInterval(()=>{
    let gamepadConnected = navigator.getGamepads()[0] !== null
    if (gamepadConnected && !buttonsPressed.s && navigator.getGamepads()[0].buttons[9].pressed){
      gameState.score = 0
      startGame()
      gameState.state = gameStates.spaceshipAnimation
      buttonsPressed.s = true
    }}, 1000/30)
}

document.getElementById('highscore-form').onsubmit = function (event) {
  event.preventDefault()
  submitHighScore(event)
}

function submitHighScore(event) {
  event.preventDefault()
  let player = nameInput.value
  if (player.length === 0) {
    player = 'Player'
  }
  const data = { Player: player, Score: gameState.score }
  fetch('https://shooter-backend-vercel.vercel.app/api/postHighscore', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
      .then(response => response.json())
      .catch(err => console.log(err))
  nameInput.value = ''
  buttonsPressed.s = false
  nameInput.style.display = 'none'
  gameState.highScoresLoaded = false
  gameState.state = gameStates.titleScreen
  gameState.round = rounds.snake
  resetGame()
}