const canvas = document.getElementById("game-canvas")
const canvasContext = canvas.getContext("2d")
const soundBTN = document.getElementById("sound-button")
const nameInput = document.getElementById("name-input")
canvasContext.font = '24px retro'

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
  playerShip: undefined,
  snakeHead: undefined,
  snakeBody: undefined,
  enemyShip: undefined,
  asteroid: undefined,
  explosion: undefined,
  trumpHead: undefined,
  background: undefined
}

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

let spaceshipX = 150
let spaceshipY = 580
let canonY = 520
let canonX = spaceshipX + 50
let shotX
let shotY
let aPressed = false
let dPressed = false
let wPressed = false
let shotFired = false
let sPressed = false
let playerKilled = false

let touchX
let touchControls = false

let score = 0
let color = 0

asteroidImage = new Image()
asteroidImage.src = imageSources.asteroid
asteroidImage2 = new Image()
asteroidImage2.src = imageSources.asteroid
asteroidImage3 = new Image()
asteroidImage3.src = imageSources.asteroid
asteroidImage4 = new Image()
asteroidImage4.src = imageSources.asteroid

const asteroids = [
  {
    x: 100,
    y: -50,
    hit: false,
    image: asteroidImage,
    countBlocker: false,
    speed: 1
  },
  {
    x: 200,
    y: -100,
    hit: false,
    image: asteroidImage2,
    countBlocker: false,
    speed: 1.2
  },
  {
    x: 300,
    y: -200,
    hit: false,
    image: asteroidImage3,
    countBlocker: false,
    speed: 0.8
  },
  {
    x: 150,
    y: -300,
    hit: false,
    image: asteroidImage4,
    countBlocker: false,
    speed: 1.2
  }
]


let enemyshipCount = 0
let enemyRequired = 6

let snake

let enemyShip1 = {
  x: 0,
  y: 60,
  speed: 1.5,
  lives: 1,
  shotFired: false,
}

let enemyShip2 = {
  x: 260,
  y: 120,
  speed: -1.5,
  lives: 1,
  shotFired: false
}

function moveEnemyShip(obj) {
  obj.x += obj.speed
  if (obj.x <= 0 || obj.x >= canvas.width - 40) {
    obj.speed = obj.speed * (-1)
  }
}

function drawEnemyShip(obj) {
  if (obj.lives > 0) {
    canvasContext.drawImage(enemyShipImage1, obj.x, obj.y, 50, 50)
  }
  if (obj.lives % 1 !== 0) {
    canvasContext.drawImage(explosion, obj.x, obj.y, 50, 50)
  }
}
function drawEnemyShots(obj, target) {
  if (obj.x + 20 >= target && obj.x <= target + 20 && obj.shotFired === false && obj.lives >= 1) {
    obj.shotX = obj.x
    obj.shotX2 = obj.x + 30
    obj.shotY = obj.y
    obj.shotFired = true

    sounds.laserEnemy.play()
  }
  if (obj.shotFired) {
    obj.shotY += 2
    canvasContext.fillStyle = "red"
    canvasContext.fillRect(obj.shotX, obj.shotY, 10, 20)
    canvasContext.fillRect(obj.shotX2, obj.shotY, 10, 20)
  }
  if (obj.shotY > canvas.height) {
    obj.shotFired = false
  }
  const hitByEnemyShot = spaceshipY < obj.shotY + 30 && spaceshipY + 10 > obj.shotY && spaceshipX + 10 < obj.shotX + 30 && spaceshipX + 80 > obj.shotX + 20 && obj.lives >= 1
  if (hitByEnemyShot) {
    displayGameoverScreen()
  }
}

function drawShipEnemies() {
  drawEnemyShip(enemyShip1)
  moveEnemyShip(enemyShip1)
  drawEnemyShots(enemyShip1, spaceshipX)
  hitDetectionShip(enemyShip1)
  drawEnemyShip(enemyShip2)
  moveEnemyShip(enemyShip2)
  drawEnemyShots(enemyShip2, spaceshipX)
  hitDetectionShip(enemyShip2)
  if (enemyShip1.lives <= 0 && enemyShip2.lives <= 0) {
    enemyShip1.shotFired = false
    enemyShip2.shotFired = false
    enemyShip1.speed *= 1.1
    enemyShip2.speed *= 1.1
    startNextRound(moveSnake)
  }
}

let hit
let snakeLives = 8
let gameSpeed = 40
let backgroundScrollPosition = -300

let intervalSnake
let intervalBackground

let highScore = 'LOAD...'
let isHighscore = false
let gameLoaded = 0

const levels = {
  asteroids: 'asteroid level',
  ships: 'ships level',
  snake: 'snake level',
}

let currentLevel = levels.asteroids

let shipRound = false
let snakeRound = false
let asteroidRound = true
let bonusScore = 0

let streak = 0
let multiplier
let shotcolor

let loadingAnimation = "."

let highscores
let displayedScreen = 'controls'
let highscoresLoaded = false
let timer = 0


function loadImages() {
  images.snakeHead = new Image()
  images.snakeHead.src = imageSources.snakeHead
  images.snakeBody = new Image()
  images.snakeBody.src = imageSources.snakeBody
  enemyShipImage1 = new Image()
  enemyShipImage1.src = imageSources.enemyShip
  trumphead = new Image()
  trumphead.src = imageSources.trumpHead
  background = new Image()
  background.src = imageSources.background
  spaceship = new Image()
  spaceship.src = imageSources.playerShip
  explosion = new Image()
  explosion.src = imageSources.explosion
}

function loadSounds() {
  sounds.laserEnemy = new Audio(soundSources.laserEnemy)
  sounds.laser = new Audio(soundSources.laser)
  sounds.laser.onloadeddata = () => gameLoaded += 10
  sounds.laser2 = new Audio(soundSources.laser2)
  sounds.laser2.onloadeddata = () => gameLoaded += 10
  sounds.laser3 = new Audio(soundSources.laser3)
  sounds.laser3.onloadeddata = () => gameLoaded += 10
  sounds.powerup = new Audio(soundSources.powerup)
  sounds.powerup.onloadeddata = () => gameLoaded += 10
  sounds.alertSound = new Audio(soundSources.alertSound)
  sounds.alertSound.onloadeddata = () => gameLoaded += 10
  sounds.hitSound = new Audio(soundSources.hitSound)
  sounds.hitSound.onloadeddata = () => gameLoaded += 10
  sounds.spaceshipSound = new Audio(soundSources.spaceshipSound)
  sounds.spaceshipSound.onloadeddata = () => gameLoaded += 10
  sounds.loseSound = new Audio(soundSources.loseSound)
  sounds.loseSound.onloadeddata = () => gameLoaded += 10
  sounds.gameMusic = new Audio(soundSources.gameMusic)
  sounds.gameMusic.onloadeddata = () => gameLoaded += 10
  sounds.gameMusic.loop = true
}

window.onload = () => {
  if (!highscoresLoaded) {
    fetch('https://backend-spaceshooter.onrender.com/')
      .then(response => response.json())
      .then(data => highscores = data)
      .then(() => highScore = highscores[0].Score)
      .then(highscoresLoaded = true)
      .then(gameLoaded += 10)
  }

  loadImages()
  loadSounds()
  canvas.addEventListener("touchstart", changeTouchPosition, false)
  canvas.addEventListener("touchmove", changeTouchPosition, false)
  canvas.addEventListener("touchend", function () { touchControls = false })
  document.addEventListener("keydown", keyDownHandler, false)
  document.addEventListener("keyup", keyUpHandler, false)
  document.addEventListener("keydown", event => {
    if (event.keyCode === 83 && !sPressed && gameLoaded >= 100 && highscoresLoaded) {
      score = 0
      startGame(moveAsteroids)
      sPressed = true
    }
  })
  intervalStartscreen = setInterval(displayStartscreen, 500)
  listenForStart = setInterval(()=>{
    let gamepadConnected = navigator.getGamepads()[0] !== null
    if (gamepadConnected && !sPressed && navigator.getGamepads()[0].buttons[9].pressed){
      startGame(moveAsteroids)
      sPressed = true
    }}, 1000/30)
}

function displayHighscores() {
  if (!highscores) {
    canvasContext.fillText('Loading Highscores...', 20, i * 50 + 50)
    return
  }
  for (let i; i < 10; i++) {
    canvasContext.fillText(highscores[i].Player, 20, i * 50 + 50)
  }

}

function displayStartscreen() {
  timer += 1
  if (!highscoresLoaded) {
    fetch('https://backend-spaceshooter.onrender.com/')
      .then(response => response.json())
      .then(data => highscores = data)
      .then(() => highScore = highscores[0].Score)
      .then(highscoresLoaded = true)
      .catch(() => {})
  }
  if (timer % 10 == 0 && highscoresLoaded) {
    if (displayedScreen === 'controls') {
      displayedScreen = 'manual' 
      return
    }
    if (displayedScreen === 'manual') {
      displayedScreen = 'highscores'
      return
    }
    else displayedScreen = 'controls'
  }
  if (displayedScreen === 'controls') {
    canvasContext.textAlign = "center"
    canvasContext.fillStyle = "black" /*black background*/
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.fillStyle = "limegreen"
    canvasContext.fillText(gameLoaded < 100 ? `Loading: ${gameLoaded}%` : "Press S to start", canvas.width / 2, canvas.height / 3)
    canvasContext.fillText(gameLoaded < 100 ? loadingAnimation : "", canvas.width / 2, canvas.height / 3 + 50)
    canvasContext.fillText("Controls", canvas.width / 2, canvas.height / 2 + 50)
    canvasContext.fillText("Left: A", canvas.width / 2, canvas.height / 2 + 100)
    canvasContext.fillText("Right: D", canvas.width / 2, canvas.height / 2 + 150)
    canvasContext.fillText("Shoot: W", canvas.width / 2, canvas.height / 2 + 200)

    switch (loadingAnimation) {
      case '.': 
        loadingAnimation = '..'
        break
      case '..': 
        loadingAnimation = '...'
        break
      case '...': 
        loadingAnimation = '.'
        break
    }
  }

  if (displayedScreen === 'highscores') {
    canvasContext.fillStyle = "black" /*black background*/
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.fillStyle = "limegreen"
    canvasContext.textAlign = "center"
    canvasContext.fillText("Highscores", canvas.width / 2, 70)
    if (!highscores || highscores.length <= 1) {
      canvasContext.textAlign = "left"
      canvasContext.fillText('Loading...', 20, 50 + 140)
    } 
    else for (let i = 0; i < 8; i++) {
      canvasContext.textAlign = "left"
      canvasContext.fillText(i + 1 + " " + highscores[i].Player, 20, i * 50 + 140)
      canvasContext.textAlign = "right"
      canvasContext.fillText(highscores[i].Score, canvas.width - 20, i * 50 + 140)
    }
  }

  if (displayedScreen === 'manual') {
    canvasContext.fillStyle = "black" /*black background*/
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.fillStyle = "limegreen"
    canvasContext.textAlign = "center"
    canvasContext.fillText("Points", canvas.width / 2, 70)
    canvasContext.textAlign = "left"
    canvasContext.fillText("GREEN Shot ", 20, 140)
    canvasContext.fillText("RED Shot ", 20, 220)
    canvasContext.fillText("BLUE Shot ", 20, 300)
    canvasContext.drawImage(asteroidImage, 30, 350, 50, 50)
    canvasContext.drawImage(enemyShipImage1, 30, 430, 50, 50)
    canvasContext.drawImage(images.snakeHead, 30, 505, 50, 50)
    canvasContext.textAlign = "right"
    canvasContext.fillText("1x PTS", canvas.width - 20, 140)
    canvasContext.fillText("2x PTS", canvas.width - 20, 220)
    canvasContext.fillText("3x PTS", canvas.width - 20, 300)
    canvasContext.fillText("5 PTS", canvas.width - 20, 380)
    canvasContext.fillText("30 PTS", canvas.width - 20, 460)
    canvasContext.fillText("10 PTS", canvas.width - 20, 540)
  }
}

function startGame(round) {
  clearInterval(intervalStartscreen)
  spaceshipAnimated = setInterval(spaceshipAnimation, 1000 / 120)
  sounds.spaceshipSound.play()
  setTimeout(cooldown, 2000)
  function cooldown() {
    clearInterval(spaceshipAnimated)
    sounds.gameMusic.play()
    resetGame()
    spaceshipY = 580
    intervalGame = setInterval(callAll, 1000 / 140)
    intervalSnake = setInterval(
      round, 1000 / gameSpeed)
    intervalBackground = setInterval(moveBackground, 1000 / 30)
  }
}

function setScore() {
  if (score > highScore) {
    highScore = score
    isHighscore = true
  }

  multiplier = Math.floor(streak / 10) + 1 <= 3 ? Math.floor(streak / 10) + 1 : 3
  canvasContext.textAlign = "start"
  canvasContext.fillStyle = "limegreen"
  canvasContext.fillText("Score", 12, 30)
  canvasContext.fillText("Hi-Score", 25 + canvas.width / 2, 30)
  canvasContext.fillStyle = "white"
  canvasContext.fillText(score, 12, 60)
  canvasContext.fillText(highScore, 25 + canvas.width / 2, 60)
}

function callAll() {
  drawEverything()
  moveShip()
  moveShipTouch()
  shoot()
  if (currentLevel === levels.snake) hitDetectionSnake()
  if (currentLevel === levels.asteroids) hitDetectionShips()
  setScore()
  gameOver()
}

function drawEverything() {
  canvasContext.fillStyle = "black" /*black background*/
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  canvasContext.drawImage(background, 0, backgroundScrollPosition)
  drawShipAndShot()
  if (currentLevel === levels.snake) drawSnake()
  if (currentLevel === levels.asteroids) drawAsteroids()
  if (currentLevel === levels.ships) drawShipEnemies()
}

function drawAsteroids() {
  canvasContext.textAlign = "center"
  canvasContext.fillStyle = "white"
  canvasContext.fillText(`${enemyshipCount}/${enemyRequired}`, canvas.width / 2, canvas.height / 2 + 100)
  /* canvasContext.fillText(`${Math.floor(backgroundScrollPosition / 10) + 30}`, canvas.width / 2, canvas.height / 2 + 150)
  if (Math.floor(backgroundScrollPosition / 10) + 30 < 10) {
    sounds.alertSound.play()
  }
  */
  moveAsteroids()
}

function moveAsteroids() {
  asteroids.forEach(roid => {
    if(roid.hit) return
    canvasContext.drawImage(roid.image, roid.x, roid.y, 40, 40)
    moveAsteroid(roid)
  })
}
function drawShipAndShot() {
  let fillColor
  switch (multiplier) {
    case 2: fillColor = 'red'; break
    case 3: fillColor = 'blue'; break
    default: fillColor = 'limegreen'
  }

  canvasContext.fillStyle = fillColor
  canvasContext.drawImage(playerKilled ? explosion : spaceship, spaceshipX, spaceshipY - 60, 80, 100);
  canvasContext.fillRect(shotX, shotY, 10, 20);
  
  if (shotFired) shotY -= 5

  if (shotY <= -20) {
    shotFired = false
    streak = 0
  }

  canvasContext.fillStyle = "limegreen"
}



function drawSnake() {
  canvasContext.filter = `hue-rotate(${color}deg)`
  snake.forEach((element, index) => {
    drawSnakeElement(index+1, element.x, element.y, element.image)
})
  canvasContext.filter = "none"
}

function drawSnakeElement(lives, x, y, element) {
  if (snakeLives >= lives) {
    canvasContext.drawImage(score >= 1000 ? trumphead : element, x, y, 40, 40)
  }
  if (snakeLives == lives - 0.5) {
    canvasContext.drawImage(explosion, x, y, 40, 40)
  }
}

function moveBackground() {
  if (levels.ships && backgroundScrollPosition < 140) {
    backgroundScrollPosition += 0.8
  }
}

function moveShip() {
  let gamepadConnected = navigator.getGamepads()[0] !== null
  if (aPressed || (gamepadConnected && navigator.getGamepads()[0].buttons[14].pressed )) {
    spaceshipX -= 4
    canonX -= 4
  }
  if (spaceshipX < -20) {
    spaceshipX = -20
    canonX = 20
  }

  if (dPressed || (gamepadConnected && navigator.getGamepads()[0].buttons[15].pressed )) {
    spaceshipX += 4
    canonX += 4
  }

  if (spaceshipX > 340) {
    spaceshipX = 340
    canonX = 380
  }
}

function moveShipTouch() {
  if (touchControls) {
    if (spaceshipX > touchX) {
      spaceshipX -= 4
      canonX -= 4
    }

    if (spaceshipX < touchX) {
      spaceshipX += 4
      canonX += 4
    }
  }
}

function changeTouchPosition(event) {
  touchControls = true
  touchX = event.targetTouches ? event.targetTouches[0].pageX - canvas.offsetLeft : event.offsetX
  if (!sPressed) {
    sPressed = true
    score = 0
    startGame(moveAsteroids)
  }
}

function keyDownHandler(event) {
  if (event.keyCode === 65 || event.keyCode === 37) {
    aPressed = true
  }
  else if (event.keyCode === 68 || event.keyCode === 39) {
    dPressed = true
  }
  else if (event.keyCode === 87 || event.keyCode === 38) {
    wPressed = true
  }
}

function keyUpHandler(event) {
  if (event.keyCode === 65 || event.keyCode === 37) {
    aPressed = false
  }
  else if (event.keyCode === 68 || event.keyCode === 39) {
    dPressed = false
  }
  else if (event.keyCode === 87 || event.keyCode === 38) {
    wPressed = false
  }
}


function shoot() {
  let gamepadConnected = navigator.getGamepads()[0] !== null
  if ((wPressed && !shotFired) || (gamepadConnected && navigator.getGamepads()[0].buttons[0].pressed && !shotFired)) {
    shotFired = true
    shotX = canonX - 5
    shotY = canonY
    switch (multiplier) {
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

  if (touchControls && !shotFired) {
    window.navigator.vibrate(100)
    shotFired = true
    shotX = canonX - 5
    shotY = canonY
    sounds.laser.play()

  }
}

function moveElement(obj) {
  obj.x -= obj.speed
  if (obj.x < -50 || obj.x > 400) {
    obj.y += 40
    obj.speed = obj.speed * (-1)
  }
}

function moveAsteroid(obj) {
  if (score < 400) {
    obj.y += obj.speed
  } else if (score < 800) {
    obj.y += obj.speed + 0.2
  } else if (score < 1200) {
    obj.y += obj.speed + 0.6
  } else {
    obj.y += obj.speed + 1
  }
  if (obj.y > canvas.height) {
    obj.y = -50
  }
}


function moveSnake() {
  snake.forEach(element => moveElement(element))
}

function hitDetection(obj) {
  if (shotY <= obj.y + 40 && shotY >= obj.y && shotX >= obj.x && shotX <= obj.x + 40 && snakeLives >= obj.lives) {
    hit = true
  }
}

function hitDetectionShip(obj) {
  let shipHit

  if (shotY <= obj.y + 40 && shotY >= obj.y && shotX >= obj.x && shotX <= obj.x + 50 && obj.lives >= 1 && shotFired) {
    obj.lives -= 0.5
    sounds.hitSound.play()
    setTimeout(() => obj.lives -= 0.5, 100)
    shotFired = false
    shotY = 600
    shipHit = true
    score += 30 * multiplier
    streak += 1
  }

  if (obj.lives <= 0 && shipHit) {
    shipHit = false
  }
}

function hitDetectionSingle(obj) {
  if (spaceshipY < obj.y + 30 && spaceshipY + 100 > obj.y && spaceshipX + 10 < obj.x + 30 && spaceshipX + 80 > obj.x + 20) {
    displayGameoverScreen()
    return
  }
  if (shotY <= obj.y + 50 && shotY >= obj.y && shotX >= obj.x - 10 && shotX <= obj.x + 50) {
    if (!obj.countBlocker) {
      sounds.hitSound.pause()
      sounds.hitSound.currentTime = 0
      sounds.hitSound.play()
      enemyshipCount += 1
      score += 5 * multiplier
      streak += 1

      if (streak % 10 == 0) {
        sounds.powerup.play()
      }
    }
    obj.countBlocker = true
    obj.image.src = imageSources.explosion
    shotFired = false
    shotY = 600
    setTimeout(() => {
      obj.hit = true
      obj.countBlocker = false
      obj.image.src = imageSources.asteroid
      obj.y = -(Math.random() * (350 - 20)) + 20
      obj.x = (Math.random() * (350 - 20)) + 20
    }, 100)
    setTimeout(() => obj.hit = false, 2000)

  }
  if (enemyshipCount == enemyRequired) {
    bonusScore = (Math.floor((140 - backgroundScrollPosition) / 4)) * multiplier
    score += bonusScore
    enemyshipCount = 0
    enemyRequired += 2
    startNextRound(drawShipEnemies)
  }
}


function hitDetectionShips() {
  asteroids.forEach(roid => hitDetectionSingle(roid))
}

function hitDetectionSnake() {

  hit = false

  snake.forEach(element => hitDetection(element))

  if (hit) {
    color += 50
    shotFired = false
    snakeLives -= 0.5
    setTimeout(() => snakeLives -= 0.5, 100)
    score += 10 * multiplier
    streak += 1

    if (streak % 10 == 0) {
      sounds.powerup.play()
    }
    shotFired = false
    shotY = 600
    setTimeout(() => { color -= 50 }, 50)
    sounds.hitSound.pause()
    sounds.hitSound.currentTime = 0
    sounds.hitSound.play()
  }


  if (snakeLives === 0) {
    startNextRound(moveAsteroids)
  }
}

document.getElementById("highscore-form").onsubmit = function (event) {
  event.preventDefault()
  sPressed = false
  nameInput.style.display = "none"
  intervalStartscreen = setInterval(displayStartscreen, 500)
  highscoresLoaded = false
  let player = nameInput.value
  if (player.length == 0) {
    player = "Player"
  }
  nameInput.value = ""
  const data = { Player: player, Score: score }
  fetch('https://backend-spaceshooter.onrender.com/post', {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .catch(err => console.log(err))
}

function gameOver() {
  if (currentLevel === levels.asteroids && Math.floor(backgroundScrollPosition / 10) + 30 <= 0) {
    displayGameoverScreen()
  }
  if (currentLevel === levels.snake && snake[2].y >= 450) {
    displayGameoverScreen()
  }
}

function displayGameoverScreen() {
  if (playerKilled) {
    window.navigator.vibrate(1000)
    currentLevel = levels.asteroids
    clearInterval(intervalSnake)
    clearInterval(intervalGame)
    clearInterval(intervalBackground)
    backgroundScrollPosition = -300
    enemyRequired = 6
    sounds.gameMusic.playbackRate = 0.5
    setTimeout(() => { 
      sounds.gameMusic.pause() 
      sounds.gameMusic.currentTime = 0 
      sounds.gameMusic.playbackRate = 1 
    }, 1000)
    streak = 0
    sounds.loseSound.play()
    setTimeout(() => {
      canvasContext.fillStyle = "black"
      canvasContext.fillRect(0, 0, canvas.width, canvas.height)
      canvasContext.fillStyle = "limegreen"
      canvasContext.textAlign = "center"
      canvasContext.fillText("Game over", canvas.width / 2, canvas.height / 2 - 100)
      canvasContext.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 - 50)
      nameInput.style.display = "block"
      nameInput.focus()
      if (isHighscore) {
        canvasContext.fillText("New Highscore", canvas.width / 2, 100)
      }
      isHighscore = false
      gameSpeed = 40
    }, 2000)
  }
  playerKilled = true
}
function startNextRound(round) {
  switch (currentLevel) {
    case levels.snake: 
      currentLevel = levels.asteroids
      break
    case levels.ships: 
      currentLevel = levels.snake
      break
    case levels.asteroids: 
      currentLevel = levels.ships
      break
  }

  clearInterval(intervalSnake)
  clearInterval(intervalGame)
  clearInterval(intervalBackground)
  spaceshipAnimated = setInterval(spaceshipAnimation, 1000 / 120)
  sounds.spaceshipSound.play()
  color += 20
  gameSpeed += 3
  canvasContext.fillStyle = "limegreen"
  canvasContext.fillText("Next round!", 100, canvas.height / 2)
  setTimeout(cooldown, 2000)
  function cooldown() {
    resetGame()
    clearInterval(spaceshipAnimated)
    spaceshipY = 580
    intervalGame = setInterval(callAll, 1000 / 140)
    intervalSnake = setInterval(
      round, 1000 / gameSpeed)
    intervalBackground = setInterval(moveBackground, 1000 / 30)
  }
}

function spaceshipAnimation() {
  canvasContext.fillStyle = "black"
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  canvasContext.drawImage(background, 0, backgroundScrollPosition)
  canvasContext.fillStyle = "limegreen"
  canvasContext.textAlign = "center"
  canvasContext.fillText(score == 0 ? "Save earth!" : "Next round!", canvas.width / 2, canvas.height / 2)
  canvasContext.fillText(bonusScore > 0 ? `Bonus Score: ${bonusScore}` : "", canvas.width / 2, canvas.height / 2 + 50)
  canvasContext.drawImage(spaceship, spaceshipX, spaceshipY - 60, 80, 100)
  spaceshipY -= 2.5
  if (backgroundScrollPosition < 80) backgroundScrollPosition += 1.2
}

function resetGame() {
  canvas
  canvasContext
  scale = 1
  snake = [{
    x: 0,
    y: 0,
    speed: 10,
    lives: 1,
    image: images.snakeHead,
  },
  {
    x: 40,
    y: 0,
    speed: 10,
    lives: 2,
    image: images.snakeBody
  },
  {
    x: 80,
    y: 0,
    speed: 10,
    lives: 3,
    image: images.snakeBody
  },
  {
    x: 120,
    y: 0,
    speed: 10,
    lives: 4,
    image: images.snakeBody
  },
  {
    x: 160,
    y: 0,
    speed: 10,
    lives: 5,
    image: images.snakeBody
  },
  {
    x: 180,
    y: 0,
    speed: 10,
    lives: 6,
    image: images.snakeBody
  },
  {
    x: 220,
    y: 0,
    speed: 10,
    lives: 7,
    image: images.snakeBody
  },
  {
    x: 260,
    y: 0,
    speed: 10,
    lives: 8,
    image: images.snakeBody
  }]

  asteroids[0].y = -50
  asteroids[1].y = -100
  asteroids[2].y = -200
  asteroids[3].y = -300
  spaceshipX = 150
  canonY = 520
  canonX = spaceshipX + 40
  shotX = canonX - 5
  shotY = canvas.height
  playerKilled = false

  enemyShip1.lives = 2
  enemyShip2.lives = 2
  enemyShip1.shotY = enemyShip1.y
  enemyShip2.shotY = enemyShip2.y

  snakeX = 0
  snakeX2 = 50
  snakeX3 = 100
  snakeX4 = 150
  snakeX5 = 200
  snakeX6 = 250
  snakeX7 = 300
  snakeX8 = 350

  snakeY = 0
  snakeY2 = 0
  snakeY3 = 0
  snakeY4 = 0
  snakeY5 = 0
  snakeY6 = 0
  snakeY7 = 0
  snakeY8 = 0

  snakeSpeed = 10
  snakeSpeed2 = 10
  snakeSpeed3 = 10
  snakeSpeed4 = 10
  snakeSpeed5 = 10
  snakeSpeed6 = 10
  snakeSpeed7 = 10
  snakeSpeed8 = 10

  snakeLives = 8
  aPressed = false
  dPressed = false
  wPressed = false
  shotFired = false

  backgroundScrollPosition = -220

  enemyshipCount = 0
  bonusScore = 0
}


const burgerMenu = document.getElementById("burger-menu")
const hamburger = document.getElementById("hamburger")
let burgerMenuShowing = false

function showMenu() {
  burgerMenuShowing = !burgerMenuShowing
  if (burgerMenuShowing) {
    burgerMenu.style.height = "100vh"
    burgerMenu.style.opacity = "0.99"
    hamburger.style.position = "fixed"
  }
  else {
    burgerMenu.style.height = "0vh"
    burgerMenu.style.opacity = "0"
    hamburger.style.position = "absolute"
  }
}

let volume = 1
function setVolume(value) {
  volume = value === 0 ? 0 : value * 2 / 10
  const volumeElements = Array.from(document.getElementsByClassName('volume-item'))
  volumeElements.forEach(element => {
          element.innerHTML = element.dataset.value > value ? '&#9645;' : '&#11036;'
  })
  for (let key in sounds) {
    if (sounds[key] instanceof Audio) {
      sounds[key].volume = volume
    }
  }
}