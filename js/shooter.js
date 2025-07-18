// _______________________________________________________________
// HTML ELEMENTS
// _______________________________________________________________

const canvas = document.getElementById('game-canvas')
const canvasContext = canvas.getContext('2d')
const nameInput = document.getElementById('name-input')
canvasContext.font = '24px retro'

// _______________________________________________________________
// IMAGES
// _______________________________________________________________

const imageSources = {
  playerShip: './images/shooter/spaceship.png',
  snakeHead: './images/shooter/snake-head.png',
  snakeBody: './images/shooter/snake.png',
  enemyShip: './images/shooter/enemy-ship.png',
  asteroid: './images/shooter/asteroid.png',
  explosion: './images/shooter/explosion.png',
  trumpHead: './images/shooter/trump-head.png',
  background: './images/shooter/background.jpg'
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
    images.snakeHead.onload = () => game.gameLoaded += 5
    images.snakeBody.onload = () => game.gameLoaded += 5
    images.enemyShip.onload = () => game.gameLoaded += 5
    images.trumpHead.onload = () => game.gameLoaded += 5
    images.background.onload = () => game.gameLoaded += 5
    images.playerShip.onload = () => game.gameLoaded += 5
    images.explosion.onload = () => game.gameLoaded += 10
    images.asteroid.onload = () => game.gameLoaded += 10
    images.snakeHead.src = imageSources.snakeHead
    images.snakeBody.src = imageSources.snakeBody
    images.enemyShip.src = imageSources.enemyShip
    images.trumpHead.src = imageSources.trumpHead
    images.background.src = imageSources.background
    images.playerShip.src = imageSources.playerShip
    images.explosion.src = imageSources.explosion
    images.asteroid.src = imageSources.asteroid
}

// _______________________________________________________________
// SOUNDS
// _______________________________________________________________

const soundSources = {
  laserEnemy: './sounds/shooter/laser-enemy.wav',
  laser: './sounds/shooter/laser.wav',
  laser2: './sounds/shooter/laser2.wav',
  laser3: './sounds/shooter/laser3.wav',
  powerUp: './sounds/shooter/shooter-power-up.wav',
  alertSound: './sounds/shooter/alert.wav',
  hitSound: './sounds/shooter/hit.wav',
  spaceshipSound: './sounds/shooter/spaceship-rising.wav',
  loseSound: './sounds/shooter/lose-shooter.wav',
  gameMusic: './sounds/shooter/space-shooter-music.mp3',
}

const sounds = {
  laserEnemy: undefined,
  laser: undefined,
  laser2: undefined,
  laser3: undefined,
  powerUp: undefined,
  alertSound: undefined,
  hitSound: undefined,
  spaceshipSound: undefined,
  loseSound: undefined,
  gameMusic: undefined,
}

function loadSounds() {
  sounds.laserEnemy = new Audio(soundSources.laserEnemy)
  sounds.laserEnemy.onloadeddata = () => game.gameLoaded += 5
  sounds.laser = new Audio(soundSources.laser)
  sounds.laser.onloadeddata = () => game.gameLoaded += 5
  sounds.laser2 = new Audio(soundSources.laser2)
  sounds.laser2.onloadeddata = () => game.gameLoaded += 5
  sounds.laser3 = new Audio(soundSources.laser3)
  sounds.laser3.onloadeddata = () => game.gameLoaded += 5
  sounds.powerUp = new Audio(soundSources.powerUp)
  sounds.powerUp.onloadeddata = () => game.gameLoaded += 5
  sounds.alertSound = new Audio(soundSources.alertSound)
  sounds.alertSound.onloadeddata = () => game.gameLoaded += 5
  sounds.hitSound = new Audio(soundSources.hitSound)
  sounds.hitSound.onloadeddata = () => game.gameLoaded += 5
  sounds.spaceshipSound = new Audio(soundSources.spaceshipSound)
  sounds.spaceshipSound.onloadeddata = () => game.gameLoaded += 5
  sounds.loseSound = new Audio(soundSources.loseSound)
  sounds.loseSound.onloadeddata = () => game.gameLoaded += 5
  sounds.gameMusic = new Audio(soundSources.gameMusic)
  sounds.gameMusic.onloadeddata = () => game.gameLoaded += 5
  sounds.gameMusic.loop = true
}

// _______________________________________________________________
// PLAYER
// _______________________________________________________________

class Player {
  constructor() {
    this.x = 150
    this.y = 580
    this.width = 80
    this.height = 100
    this.killed = false
    this.shotCoolDown = false
    this.shots = []
  }

  activeShots() {
    return this.shots.filter(shot => shot.isActive)
  }

  draw() {
    canvasContext.drawImage(this.killed ? images.explosion : images.playerShip, this.x, this.y - 60, this.width, this.height)
  }

  move() {
    let gamepadConnected = navigator.getGamepads()[0] !== null
    if (buttonsPressed.a || (gamepadConnected && navigator.getGamepads()[0].buttons[14].pressed )) {
      this.x -= 4
    }
    if (this.x < -20) {
      this.x = -20
    }

    if (buttonsPressed.d || (gamepadConnected && navigator.getGamepads()[0].buttons[15].pressed )) {
      this.x += 4
    }

    if (this.x > 340) {
      this.x = 340
    }
  }

  moveTouch() {
    if (touchControls.active) {
      if (this.x > touchControls.x) {
        this.x -= 4
      }

      if (this.x < touchControls.x) {
        this.x += 4
      }
    }
  }

  shoot() {
    if (this.shotCoolDown) return
    const gamepadConnected = navigator.getGamepads()[0] !== null

    if (buttonsPressed.w || (gamepadConnected && navigator.getGamepads()[0].buttons[0].pressed)) {
      this.shotCoolDown = true
      setTimeout(() => this.shotCoolDown = false, 350)
      const shot = new Shot()
      this.shots.push(shot)
      shot.playSound()
    }

    if (touchControls.active) {
      this.shotCoolDown = true
      setTimeout(() => this.shotCoolDown = false, 350)
      const shot = new Shot()
      this.shots.push(shot)
      shot.playSound()
    }
  }
}

// _______________________________________________________________
// GAME DATA
// _______________________________________________________________

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

const screens = {
  controls: 'controls screen',
  manual: 'game manual',
  highScores: 'highScore list',
}

const intervals = {
  game: null,
  enemies: null,
  background: null,
  listenForStart: null,
}

class Game {
  constructor() {
    this.state = gameStates.titleScreen
    this.round = null
    this.score = 0
    this.highScore = 'LOADING...'
    this.isHighScore = false
    this.highScores = null
    this.highScoresLoaded = false
    this.highScoresLoading = false
    this.loadingAnimation = '.'
    this.multiplier = 0
    this.streak = 0
    this.gameSpeed = 60
    this.musicRunning = false
    this.backgroundScrollPosition = -1900
    this.gameLoaded = 0
    this.displayedScreen = screens.controls
    this.volume = 1
    this.player = new Player()
  }

  startGame() {
    sounds.spaceshipSound.play()
    this.state = gameStates.spaceshipAnimation
  }

  resetGame() {
    this.player.shots.length = 0
    this.player.shotCoolDown = false
    resetAsteroids()
    addSnakeElements()
    this.player.x = 150
    this.player.killed = false
    this.player.y = 580
    enemyShips.length = 0
    enemyShips.push(new EnemyShip(0,60), new EnemyShip(260, 120))
    if (this.score > 1500) enemyShips.push(new EnemyShip(0, 180))
    buttonsPressed.a = false
    buttonsPressed.d = false
    buttonsPressed.w = false
    this.backgroundScrollPosition = -1900
  }

  handleGameOver() {
    this.player.killed = true
    window.navigator.vibrate(1000)
    this.round = rounds.asteroids
    clearInterval(intervals.enemies)
    clearInterval(intervals.game)
    clearInterval(intervals.background)
    sounds.gameMusic.playbackRate = 0.5
    this.musicRunning  = false
    setTimeout(() => {
      sounds.gameMusic.pause()
      sounds.gameMusic.currentTime = 0
      sounds.gameMusic.playbackRate = 1
    }, 1000)
    this.streak = 0
    sounds.loseSound.play()
    setTimeout(() => {
      this.state = gameStates.gameOver
      this.isHighScore = false
      this.gameSpeed = 60
    }, 2000)
  }

  runGame = () => {
    this.player.move()
    this.player.moveTouch()
    this.player.shoot()
    this.setScore()
  }

  startNextRound() {
    this.resetGame()
    if (!this.musicRunning) {
      sounds.gameMusic.play()
      this.musicRunning = true
    }
    switch (this.round) {
      case null:
        respawnAsteroids = true
        this.round = rounds.asteroids
        this.state = gameStates.asteroidsRound
        setTimeout(() => respawnAsteroids = false, 10000)
        break
      case rounds.snake:
        respawnAsteroids = true
        this.round = rounds.asteroids
        this.state = gameStates.asteroidsRound
        setTimeout(() => respawnAsteroids = false, 10000)
        break
      case rounds.enemyShips:
        this.round = rounds.snake
        this.state = gameStates.snakeRound
        break
      case rounds.asteroids:
        this.round = rounds.enemyShips
        this.state = gameStates.enemyShipRound
        break
    }
    intervals.game = setInterval(this.runGame, 1000 / 140)
    intervals.enemies = setInterval(this.runEnemies, 1000 / this.gameSpeed)
    intervals.background = setInterval(game.moveBackground, 1000 / 30)
  }

  endLevel() {
    clearInterval(intervals.enemies)
    clearInterval(intervals.game)
    clearInterval(intervals.background)
    this.state = gameStates.spaceshipAnimation
    sounds.spaceshipSound.play()
    snake.color += 20
    this.gameSpeed += 2
    canvasContext.fillStyle = 'limegreen'
    canvasContext.fillText('Next round!', 100, canvas.height / 2)
  }

  runEnemies = () => {
    if (this.round === rounds.snake) {
      snake.elements.forEach(element => {
        element.move()
        this.player.activeShots().forEach(shot => element.hitDetection(shot))
      })

      if(snake.elements[0].lives === 0 || !snake.elements.some(element => element.lives > 0)) this.endLevel()
    }
    if (this.round === rounds.asteroids) {
      activeAsteroids().forEach(asteroid => {
        asteroid.moveAsteroid()
        asteroid.detectCollisionWithShip()
        this.player.activeShots().forEach(shot => asteroid.detectCollisionWithShot(shot))
      })

      if (activeAsteroids().length === 0) {
        this.endLevel()
      }
    }
    if (this.round === rounds.enemyShips) {
      moveShipEnemies()
    }
  }

  setScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score
      this.isHighScore = true
    }

    this.multiplier = Math.floor(this.streak / 10) + 1 <= 3 ? Math.floor(this.streak / 10) + 1 : 3
  }

  switchInfoScreen() {
    if (this.state !== gameStates.titleScreen || !this.highScoresLoaded) return

    setTimeout(() => this.switchInfoScreen(), 5000)

    if (this.displayedScreen === screens.controls) {
      this.displayedScreen = screens.manual
      return
    }
    if (this.displayedScreen === screens.manual) {
      this.displayedScreen = screens.highScores
    }
    else this.displayedScreen = screens.controls
  }

  drawStartScreen() {
    if (!this.highScoresLoaded && !this.highScoresLoading) {
      this.fetchHighScores()
      return
    }

    if (this.displayedScreen === screens.controls) {
      this.drawControlsScreen()
    }

    if (this.displayedScreen === screens.highScores) {
      this.drawHighScores()
    }

    if (this.displayedScreen === screens.manual) {
      this.drawManual()
    }
  }

  drawControlsScreen() {
    canvasContext.fillText(this.gameLoaded < 100 ? `Loading: ${this.gameLoaded}%` : 'Press S to start', canvas.width / 2, canvas.height / 3)
    canvasContext.fillText(this.gameLoaded < 100 ? this.loadingAnimation : '', canvas.width / 2, canvas.height / 3 + 50)
    canvasContext.fillText('Controls', canvas.width / 2, canvas.height / 2 + 50)
    canvasContext.fillText('Left: A', canvas.width / 2, canvas.height / 2 + 100)
    canvasContext.fillText('Right: D', canvas.width / 2, canvas.height / 2 + 150)
    canvasContext.fillText('Shoot: W', canvas.width / 2, canvas.height / 2 + 200)

    this.drawLoadingAnimation()
  }

  drawManual() {
    canvasContext.fillText('Points', canvas.width / 2, 70)
    canvasContext.textAlign = 'left'
    canvasContext.fillText('GREEN Shot ', 20, 140)
    canvasContext.fillText('RED Shot ', 20, 220)
    canvasContext.fillText('BLUE Shot ', 20, 300)
    canvasContext.drawImage(images.asteroid, 30, 350, 50, 50)
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

  drawHighScores() {
    canvasContext.fillText('HighScores', canvas.width / 2, 70)

    if (!this.highScores || this.highScores.length <= 1) {
      canvasContext.textAlign = 'left'
      canvasContext.fillText('Loading...', 20, 50 + 140)
    }
    else for (let i = 0; i < 8; i++) {
      canvasContext.textAlign = 'left'
      canvasContext.fillText(i + 1 + ' ' + this.highScores[i].Player, 20, i * 50 + 140)
      canvasContext.textAlign = 'right'
      canvasContext.fillText(this.highScores[i].Score, canvas.width - 20, i * 50 + 140)
    }
  }

  drawLoadingAnimation() {
    if (this.loadingAnimation.length < 3) this.loadingAnimation += '.'
    if (this.loadingAnimation.length >= 3) this.loadingAnimation = ''
  }

  drawGameOverScreen() {
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.fillStyle = 'limegreen'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('Game over', canvas.width / 2, canvas.height / 2 - 100)
    canvasContext.fillText('Score: ' + this.score, canvas.width / 2, canvas.height / 2 - 50)
    nameInput.style.display = 'block'
    nameInput.focus()
    if (this.isHighScore) {
      canvasContext.fillText('New HighScore', canvas.width / 2, 100)
    }
  }

  drawShipAndShot() {
    this.player.draw()

    if (this.player.activeShots().length > 0) this.player.activeShots().forEach(shot => {
      shot.move()
      shot.draw()
    })
  }

  drawScore() {
    canvasContext.textAlign = 'start'
    canvasContext.fillStyle = 'limegreen'
    canvasContext.fillText('Score', 12, 30)
    canvasContext.fillText('Hi-Score', 25 + canvas.width / 2, 30)
    canvasContext.fillStyle = 'white'
    canvasContext.fillText(this.score, 12, 60)
    canvasContext.fillText(this.highScore, 25 + canvas.width / 2, 60)
  }

  drawSpaceshipAnimation() {
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.drawImage(images.background, 0, this.backgroundScrollPosition)
    canvasContext.fillStyle = 'limegreen'
    canvasContext.textAlign = 'center'
    canvasContext.fillText(this.score === 0 ? 'Save earth!' : 'Next round!', canvas.width / 2, canvas.height / 2)
    canvasContext.drawImage(images.playerShip, this.player.x, this.player.y - 60, this.player.width, this.player.height)
    this.player.y -= 5
    if (this.backgroundScrollPosition < 80) this.backgroundScrollPosition += 2.5
    if (this.player.y < -50) {
      this.startNextRound()
    }
  }

  drawEverything = () => {
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.drawImage(images.background, 0, this.backgroundScrollPosition)
    this.drawShipAndShot()
    this.drawScore()

    if (this.state === gameStates.titleScreen) {
      canvasContext.fillStyle = 'black'
      canvasContext.fillRect(0, 0, canvas.width, canvas.height)
      canvasContext.textAlign = 'center'
      canvasContext.fillStyle = 'limegreen'
      this.drawStartScreen()
    }

    if (this.state === gameStates.spaceshipAnimation) {
      this.drawSpaceshipAnimation()
    }

    if (this.state === gameStates.asteroidsRound) {
      activeAsteroids().forEach(asteroid => asteroid.drawAsteroid())
    }

    if (this.state === gameStates.enemyShipRound) {
      enemyShips.forEach(enemy => {
        enemy.drawShip()
        enemy.drawShot()
      })
    }

    if (this.state === gameStates.snakeRound) {
      snake.elements.forEach(element => element.draw())
    }

    if (this.state === gameStates.gameOver) {
      this.drawGameOverScreen()
    }

    requestAnimationFrame(this.drawEverything)
  }

  moveBackground = () => {
    if (this.backgroundScrollPosition < 140) {
      this.backgroundScrollPosition += 4
    }
  }

  setVolume(value) {
    this.volume = value === 0 ? 0 : value * 2 / 10
    sessionStorage.setItem('volume', value)
    const volumeElements = Array.from(document.getElementsByClassName('volume-item'))
    volumeElements.forEach(element => {
      element.innerHTML = element.dataset.value > value ? '&#9645;' : '&#11036;'
    })
    for (let key in sounds) {
      if (sounds[key] instanceof Audio) {
        sounds[key].volume = this.volume
      }
    }
  }

  fetchHighScores() {
      this.highScoresLoading = true
      fetch('https://shooter-backend-vercel.vercel.app/api/getHighscores')
          .then(response => response.json())
          .then(data => this.highScores = data)
          .then(() => {
            this.highScore = this.highScores[0]?.Score || 1000
            this.highScoresLoaded = true
            this.highScoresLoading = false
            this.switchInfoScreen()
          })
          .catch(() => this.highScoresLoading = false)
  }

  postHighScore(event) {
    event.preventDefault()
    let playerName = nameInput.value
    if (playerName.length === 0) {
      playerName = 'Player'
    }
    const data = { Player: playerName, Score: game.score }
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
    this.highScoresLoaded = false
    this.fetchHighScores()
    this.state = gameStates.titleScreen
    this.round = null
    this.resetGame()
  }
}

let game = new Game()

function setVolume(value) {
  game.setVolume(value)
}

// _______________________________________________________________
// ASTEROIDS
// _______________________________________________________________

const asteroids = []
const addAsteroids = () => asteroids.push(new Asteroid(100, -50, 30, 2), new Asteroid(200, -100, 40, 2.4),
    new Asteroid(300, -200, 60, 1.6), new Asteroid(150, -300, 80, 2),
    new Asteroid(50, -150, 30, 3), new Asteroid(250, -400, 100, 1.5))

const activeAsteroids = () => asteroids.filter(asteroid => !asteroid.hit)

const resetAsteroids = () => {
  asteroids.length = 0
  addAsteroids()
}

let respawnAsteroids = false

class Asteroid {
  constructor(x, y, size, speed) {
    this.x = x
    this.y = y
    this.width = size
    this.height = size
    this.hit = false
    this.countBlocker = false
    this.speed = speed
  }

  moveAsteroid() {
    if (this.hit) return
    if (game.score < 400) {
      this.y += this.speed
    } else if (game.score < 800) {
      this.y += this.speed + 0.2
    } else if (game.score < 1200) {
      this.y += this.speed + 0.6
    } else {
      this.y += this.speed + 1
    }
    if (this.y > canvas.height) {
      this.hit = true
      if (respawnAsteroids) this.addNewAsteroid()
    }
  }

  drawAsteroid() {
    canvasContext.drawImage(
        this.countBlocker ? images.explosion : images.asteroid,
        this.x,
        this.y,
        this.width,
        this.height)
  }

  addNewAsteroid() {
    const maxAsteroidY = 350
    const minAsteroidY = 100
    const maxAsteroidX = canvas.width - this.width
    const minAsteroidX = 0
    const y = -(Math.random() * (maxAsteroidY - minAsteroidY)) - minAsteroidY
    const x = (Math.random() * (maxAsteroidX - minAsteroidX)) + minAsteroidX
    if (respawnAsteroids) asteroids.push(new Asteroid(x,y,this.width, this.speed))
  }

  detectCollisionWithShip() {
    if (this.hit) return

    const sameY = game.player.y < this.y + this.height && game.player.y + 100 > this.y
    const sameX = game.player.x + 10 < this.x + this.width &&
        game.player.x + 80 > this.x + this.width

    if (sameY && sameX) {
      game.handleGameOver()
    }
  }

  detectCollisionWithShot(shot) {
    const sameX = shot.x >= this.x - 10 && shot.x + shot.width <= this.x + this.width + 10
    const sameY = shot.y <= this.y + this.height && shot.y >= this.y

    if (sameY && sameX) {
      if (!this.countBlocker) {
        shot.isActive = false
        sounds.hitSound.pause()
        sounds.hitSound.currentTime = 0
        sounds.hitSound.play()
        game.score += 5 * game.multiplier
        game.streak += 1

        if (game.streak % 10 === 0 && game.streak <= 30) {
          sounds.powerUp.play()
        }
      }

      this.countBlocker = true

      setTimeout(() => {
        this.hit = true
        this.addNewAsteroid()
      }, 100)
    }
  }
}

addAsteroids()

// _______________________________________________________________
// ENEMY SHIPS
// _______________________________________________________________

class EnemyShip {
  constructor(x,y) {
      this.x = x
      this.y = y
      this.width = 50
      this.height = 50
      this.speed = 4
      this.lives = 2
      this.shotFired = false
      this.shotSpeed = 5
      this.shotX = 0
      this.shotX2 = 0
      this.shotY = 0
      this.shotWidth = 10
      this.shotHeight = 20
  }

  drawShip() {
    if (this.lives >= 1) {
      canvasContext.drawImage(images.enemyShip, this.x, this.y, this.width, this.height)
    }
    if (this.lives % 1 !== 0) {
      canvasContext.drawImage(images.explosion, this.x, this.y, this.width, this.height)
    }
  }

  drawShot() {
    if (this.shotFired) {
      canvasContext.fillStyle = 'red'
      canvasContext.fillRect(this.shotX, this.shotY, this.shotWidth, this.shotHeight)
      canvasContext.fillRect(this.shotX2, this.shotY, this.shotWidth, this.shotHeight)
    }
  }

  moveShip() {
    this.x += this.speed
    if (this.x <= 0 || this.x >= canvas.width - 40) {
      this.speed = -this.speed
    }
  }

  moveShots() {
    if (this.x + 20 >= game.player.x && this.x <= game.player.x + 20 && this.shotFired === false && this.lives >= 1) {
      this.shotX = this.x
      this.shotX2 = this.x + 30
      this.shotY = this.y
      this.shotFired = true

      sounds.laserEnemy.play()
    }
    if (this.shotFired) {
      this.shotY += this.shotSpeed
    }
    if (this.shotY > canvas.height) {
      this.shotFired = false
    }

    this.detectHittingPlayer()
  }

  detectHittingPlayer() {
    const shotCollisionX = game.player.x + 10 < this.shotX + 30 && game.player.x + 80 > this.shotX + 20
    const shotCollisionY = game.player.y < this.shotY + 30 && game.player.y + 10 > this.shotY
    const hitByEnemyShot =  shotCollisionX && shotCollisionY && this.lives >= 1
    if (hitByEnemyShot) {
      game.handleGameOver()
    }
  }

  detectHitByPlayer(shot) {
    if (this.lives <= 0) return
    const collisionY = shot.y <= this.y + 40 && shot.y >= this.y
    const collisionX = shot.x >= this.x &&
        shot.x + shot.width <= this.x + 50

    if (collisionY && collisionX && this.lives >= 1 && shot.isActive) {
      this.lives -= 0.5
      sounds.hitSound.play()
      setTimeout(() => this.lives -= 0.5, 100)
      shot.isActive = false
      game.score += 30 * game.multiplier
      game.streak += 1
    }
  }
}

function moveShipEnemies() {
  enemyShips.forEach(enemy => {
    enemy.moveShip()
    enemy.moveShots()
    enemy.detectHittingPlayer()
    game.player.activeShots().forEach(shot => enemy.detectHitByPlayer(shot))
  })

  if (!enemyShips.some(enemy => enemy.lives > 0)) {
    game.endLevel()
  }
}

const enemyShips = [new EnemyShip(0,60), new EnemyShip(260, 120)]

// _______________________________________________________________
// SNAKE
// _______________________________________________________________

class SnakeElement {
  constructor(x,isHead) {
    this.x = x
    this.y = 0
    this.size = 40
    this.speed = 8
    this.lives = isHead ? 4 : 1
    this.image = isHead ? images.snakeHead : images.snakeBody
  }

  draw() {
    canvasContext.fillStyle = '#80008055'
    if (this.lives === 0) {
      canvasContext.fillRect(this.x, this.y + this.size / 2 - 4, this.size, 8)
      return
    }
    canvasContext.filter = `hue-rotate(${snake.color}deg)`
    if (this.lives > 0.5) {
      canvasContext.drawImage(game.score >= 1510 && game.score < 2000
          ? images.trumpHead : this.image, this.x, this.y, this.size, this.size)
    }

    if (this.lives % 1 !== 0) {
      canvasContext.drawImage(images.explosion, this.x, this.y, this.size, this.size)
    }
    canvasContext.filter = 'none'
  }

  move() {
    this.x -= this.speed
    if (this.x < -50 || this.x > 400) {
      this.y += 40
      this.speed = - this.speed
    }

    if (this.lives > 0.5 && this.y >= 450 && this.x < canvas.width - 20) game.handleGameOver()
  }

  hitDetection(shot) {
    const collisionY = shot.y <= this.y + 40 && shot.y >= this.y
    const collisionX = shot.x >= this.x && shot.x + shot.width <= this.x + 40
    if (collisionY && collisionX && this.lives > 0.5) {
      shot.isActive = false
      snake.color += 50
      this.lives -= 0.5
      setTimeout(() => this.lives -= 0.5, 100)
      game.score += 10 * game.multiplier
      game.streak += 1

      if (game.streak % 10 === 0) {
        sounds.powerUp.play()
      }

      setTimeout(() => { snake.color -= 50 }, 50)
      sounds.hitSound.pause()
      sounds.hitSound.currentTime = 0
      sounds.hitSound.play()
    }
  }
}

const snake = {
  elements: [],
  color: 0,
}

function addSnakeElements () {
  snake.elements.length = 0
  snake.elements = [
    new SnakeElement(0,true),
    new SnakeElement(40,false),
    new SnakeElement(80,false),
    new SnakeElement(120,false),
    new SnakeElement(160,false),
    new SnakeElement(200,false),
    new SnakeElement(240,false),
    new SnakeElement(280,false)
  ]
}

addSnakeElements()

// _______________________________________________________________
// SHOTS
// _______________________________________________________________

class Shot {
  constructor() {
    this.width = 10
    this.height = 20
    this.x = game.player.x + 40 - this.width / 2
    this.y = game.player.y - 60
    this.isActive = true
  }

  move() {
    if (this.isActive) this.y -= 10

    if (this.y <= -20) {
      this.isActive = false
      game.streak = 0
    }
  }

  draw() {
    let fillColor
    switch (game.multiplier) {
      case 2: fillColor = 'red'; break
      case 3: fillColor = 'blue'; break
      default: fillColor = 'limegreen'
    }

    canvasContext.fillStyle = fillColor
    canvasContext.fillRect(this.x, this.y, this.width, this.height)
    canvasContext.fillStyle = 'limegreen'
  }

  playSound() {
    switch (game.multiplier) {
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
}

// _______________________________________________________________
// CONTROLS
// _______________________________________________________________

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

function changeTouchPosition(event) {
  touchControls.active = true
  touchControls.x = event.targetTouches ? event.targetTouches[0].pageX - canvas.offsetLeft : event.offsetX
  if (!buttonsPressed.s) {
    buttonsPressed.s = true
    game.score = 0
    game.startGame()
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
  if (event.key === 's' && !buttonsPressed.s && game.gameLoaded >= 100 && game.highScoresLoaded) {
    game.score = 0
    game.startGame()
    game.state = gameStates.spaceshipAnimation
    buttonsPressed.s = true
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
// INITIALIZE GAME
// _______________________________________________________________

window.onload = () => {
  game.fetchHighScores()

  loadImages()
  loadSounds()

  const volumeFromSessionStorage = sessionStorage.getItem('volume')
  if (volumeFromSessionStorage) game.setVolume(parseFloat(volumeFromSessionStorage))

  requestAnimationFrame(game.drawEverything)

  canvas.addEventListener('touchstart', changeTouchPosition, false)
  canvas.addEventListener('touchmove', changeTouchPosition, false)
  canvas.addEventListener('touchend', function () { touchControls.active = false })
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)

  intervals.listenForStart = setInterval(()=>{
    let gamepadConnected = navigator.getGamepads()[0] !== null
    if (gamepadConnected && !buttonsPressed.s && navigator.getGamepads()[0].buttons[9].pressed){
      game.score = 0
      game.startGame()
      game.state = gameStates.spaceshipAnimation
      buttonsPressed.s = true
    }}, 1000/30)

    document.getElementById('high-score-form').onsubmit = function (event) {
      event.preventDefault()
      game.postHighScore(event)
    }
}