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
    images.explosion.onload = () => game.gameLoaded += 5
    images.asteroid.onload = () => game.gameLoaded += 5
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
  hitSound: './sounds/shooter/hit2.wav',
  spaceshipSound: './sounds/shooter/spaceship-rising.wav',
  loseSound: './sounds/shooter/lose-shooter.wav',
  gameMusic: './sounds/shooter/space-shooter-music.mp3',
  shieldUp: './sounds/shooter/shield-up.wav',
  shieldDown: './sounds/shooter/shield-down.wav',
  explosion: './sounds/shooter/explosion.wav',
  explosion2: './sounds/shooter/explosion2.wav',
}

const sounds = {
  laserEnemy: undefined,
  laser: undefined,
  laser2: undefined,
  laser3: undefined,
  powerUp: undefined,
  hitSound: undefined,
  spaceshipSound: undefined,
  loseSound: undefined,
  gameMusic: undefined,
  shieldUp: undefined,
  shieldDown: undefined,
  explosion: undefined,
  explosion2: undefined,
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
  sounds.hitSound = new Audio(soundSources.hitSound)
  sounds.hitSound.onloadeddata = () => game.gameLoaded += 5
  sounds.spaceshipSound = new Audio(soundSources.spaceshipSound)
  sounds.spaceshipSound.onloadeddata = () => game.gameLoaded += 5
  sounds.loseSound = new Audio(soundSources.loseSound)
  sounds.loseSound.onloadeddata = () => game.gameLoaded += 5
  sounds.gameMusic = new Audio(soundSources.gameMusic)
  sounds.gameMusic.onloadeddata = () => game.gameLoaded += 5
  sounds.gameMusic.loop = true
  sounds.shieldUp = new Audio(soundSources.shieldUp)
  sounds.shieldUp.onloadeddata = () => game.gameLoaded += 5
  sounds.shieldDown = new Audio(soundSources.shieldDown)
  sounds.shieldDown.onloadeddata = () => game.gameLoaded += 5
  sounds.explosion = new Audio(soundSources.explosion)
  sounds.explosion.onloadeddata = () => game.gameLoaded += 3
  sounds.explosion2 = new Audio(soundSources.explosion2)
  sounds.explosion2.onloadeddata = () => game.gameLoaded += 2
}

// _______________________________________________________________
// PLAYER
// _______________________________________________________________

class Player {
  constructor() {
    this.height = 64
    this.width = 40
    this.x = canvas.width / 2 - this.width / 2
    this.y = canvas.height - this.height
    this.killed = false
    this.coolDownPlayer = 400
    this.isShotCoolDown = false
    this.shots = []
    this.activeShots = []
    this.hasShield = false
    this.isInvincible = false
    this.hasWideShot = false
    this.hasLongShot = false
  }

  setActiveShots() {
    this.activeShots = this.shots.filter(shot => shot.isActive)
  }

  draw() {
    if (!this.hasShield && this.isInvincible) {
      canvasContext.filter = 'hue-rotate(180deg) brightness(1.2) saturate(1.5)'
    } else canvasContext.filter = 'none'

    this.killed
        ? canvasContext.drawImage(images.explosion, this.x + (this.height - this.width) / 2, this.y, this.height, this.height)
        : canvasContext.drawImage(images.playerShip, this.x, this.y, this.width, this.height)
    if (!this.hasShield) return
    const radius = 50
    const x = this.x + this.width / 2
    const y = this.y + this.height / 2
    canvasContext.beginPath()
    canvasContext.arc(x, y, radius, 0, Math.PI * 2)
    const gradient = canvasContext.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)')
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0.3)')
    canvasContext.fillStyle = gradient
    canvasContext.fill()
  }

  move() {
    let gamepadConnected = navigator.getGamepads()[0] !== null
    if (buttonsPressed.a || (gamepadConnected && navigator.getGamepads()[0].buttons[14].pressed )) {
      this.x -= 4
    }
    if (this.x < 0) {
      this.x = 0
    }

    if (buttonsPressed.d || (gamepadConnected && navigator.getGamepads()[0].buttons[15].pressed )) {
      this.x += 4
    }

    if (this.x > canvas.width - this.width) {
      this.x = canvas.width - this.width
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
    if (this.isShotCoolDown) return
    const gamepadConnected = navigator.getGamepads()[0] !== null

    if (buttonsPressed.w || (gamepadConnected && navigator.getGamepads()[0].buttons[0].pressed) || touchControls.active) {
      this.isShotCoolDown = true
      setTimeout(() => this.isShotCoolDown = false, this.coolDownPlayer)
      const shot = new Shot(this.hasWideShot, this.hasLongShot)
      this.shots.push(shot)
      game.player.setActiveShots()
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
    this.gameSpeed = 60
    this.musicRunning = false
    this.backgroundScrollPosition = -1900
    this.gameLoaded = 0
    this.displayedScreen = screens.controls
    this.volume = 1
    this.player = new Player()
    this.respawnAsteroids = false
    this.asteroids = []
    this.activeAsteroids = []
    this.enemyShips = []
    this.snake = {
      elements: [],
      color: 0,
    }
    this.powerUp = null
    this.minScoreForHardMode = 1200
  }

  startGame() {
    sounds.spaceshipSound.play()
    this.state = gameStates.spaceshipAnimation
  }

  resetGame() {
    this.player.shots.length = 0
    this.player.shotCoolDown = false
    this.resetAsteroids()
    this.addSnakeElements()
    this.player.x = canvas.width / 2 - this.player.width / 2
    this.player.killed = false
    this.player.y = canvas.height - this.player.height
    this.powerUp = null
    this.enemyShips.length = 0
    this.enemyShips.push(new EnemyShip(0,60, false), new EnemyShip(260, 120, true))
    if (this.score > this.minScoreForHardMode) this.enemyShips.push(new EnemyShip(0, 180, false))
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
        this.respawnAsteroids = true
        this.round = rounds.asteroids
        this.state = gameStates.asteroidsRound
        setTimeout(() => this.respawnAsteroids = false, 10000)
        break
      case rounds.snake:
        this.respawnAsteroids = true
        this.round = rounds.asteroids
        this.state = gameStates.asteroidsRound
        if (this.score > 250) this.powerUp = new PowerUp(powerUpTypes.shield)
        setTimeout(() => this.respawnAsteroids = false, 10000)
        break
      case rounds.asteroids:
        this.round = rounds.enemyShips
        this.state = gameStates.enemyShipRound
        if (this.score > 500) this.powerUp = new PowerUp(powerUpTypes.wideShot)
        break
      case rounds.enemyShips:
        this.round = rounds.snake
        this.state = gameStates.snakeRound
        if (this.score > 750) this.powerUp = new PowerUp(powerUpTypes.longShot)
        break
    }
    intervals.game = setInterval(this.runGame, 1000 / 140)
    intervals.enemies = setInterval(this.runEnemies, 1000 / this.gameSpeed)
    intervals.background = setInterval(game.moveBackground, 1000 / 60)
  }

  endLevel() {
    clearInterval(intervals.enemies)
    clearInterval(intervals.game)
    setTimeout(() => {
      clearInterval(intervals.background)
      this.state = gameStates.spaceshipAnimation
      sounds.spaceshipSound.play()
      this.snake.color += 20
      this.gameSpeed += 2
      canvasContext.fillStyle = 'limegreen'
      canvasContext.fillText('Next round!', 100, canvas.height / 2)
    }, 500)
  }

  runEnemies = () => {
    if (this.powerUp) {
      this.powerUp.move()
      this.powerUp.detectCollisionWithPlayer()
    }

    if (this.round === rounds.snake) {
      this.snake.elements.forEach(element => {
        element.move()
        this.player.activeShots.forEach(shot => element.hitDetection(shot))
      })

      if(this.snake.elements[0].lives === 0) {
        this.snake.elements.forEach((element, index) => {
          setTimeout(() => {
            sounds.explosion.pause()
            sounds.explosion.currentTime = 0
            sounds.explosion.play()
            element.lives = 0.5
          }, index * 60)
        })
        this.endLevel()
      }
    }
    if (this.round === rounds.asteroids) {
      this.activeAsteroids.forEach(asteroid => {
        asteroid.moveAsteroid()
        asteroid.detectCollisionWithShip()
        this.player.activeShots.forEach(shot => asteroid.detectCollisionWithShot(shot))
      })

      if (this.activeAsteroids.length === 0) {
        this.endLevel()
      }
    }
    if (this.round === rounds.enemyShips) {
      this.moveShipEnemies()
    }
  }

  moveShipEnemies() {
    this.enemyShips.forEach(enemy => {
      enemy.moveShip()
      this.player.activeShots.forEach(shot => enemy.detectHitByPlayer(shot))
    })

    if (!this.enemyShips.some(enemy => enemy.lives > 0)) this.endLevel()
  }

  setScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score
      this.isHighScore = true
    }
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
    canvasContext.textAlign = 'center'
    canvasContext.fillStyle = 'limegreen'
    canvasContext.fillText('Power-Ups', canvas.width / 2, 70)
    canvasContext.textAlign = 'left'

    const shieldPowerUpX = 50
    const shieldPowerUpY = 130
    canvasContext.beginPath()
    canvasContext.arc(shieldPowerUpX, shieldPowerUpY, 20, 0, Math.PI * 2)
    const shieldGradient = canvasContext.createRadialGradient(shieldPowerUpX, shieldPowerUpY, 0, shieldPowerUpX, shieldPowerUpY, 20)
    shieldGradient.addColorStop(0, 'rgba(0, 155, 255, 0.6)')
    shieldGradient.addColorStop(1, 'rgba(0, 0, 255, 0.6)')
    canvasContext.fillStyle = shieldGradient
    canvasContext.fill()
    canvasContext.fillStyle = 'limegreen'
    const textWidthShield = canvasContext.measureText('S').width
    canvasContext.fillText('S', shieldPowerUpX - textWidthShield / 2, shieldPowerUpY + 20 / 3)

    const wideShotPowerUpX = 50
    const wideShotPowerUpY = 190
    canvasContext.beginPath()
    canvasContext.arc(wideShotPowerUpX, wideShotPowerUpY, 20, 0, Math.PI * 2)
    const wideShotGradient = canvasContext.createRadialGradient(wideShotPowerUpX, wideShotPowerUpY, 0, wideShotPowerUpX, wideShotPowerUpY, 20)
    wideShotGradient.addColorStop(0, 'rgba(255, 155, 0, 0.6)')
    wideShotGradient.addColorStop(1, 'rgba(255, 0, 0, 0.6)')
    canvasContext.fillStyle = wideShotGradient
    canvasContext.fill()
    canvasContext.fillStyle = 'limegreen'
    const textWidthWideShot = canvasContext.measureText('W').width
    canvasContext.fillText('W', wideShotPowerUpX - textWidthWideShot / 2, wideShotPowerUpY + 20 / 3)

    const longShotPowerUpX = 50
    const longShotPowerUpY = 250
    canvasContext.beginPath()
    canvasContext.arc(longShotPowerUpX, longShotPowerUpY, 20, 0, Math.PI * 2)
    const longShotGradient = canvasContext.createRadialGradient(longShotPowerUpX, longShotPowerUpY, 0, longShotPowerUpX, longShotPowerUpY, 20)
    longShotGradient.addColorStop(0, 'rgba(0, 0, 255, 0.6)')
    longShotGradient.addColorStop(1, 'rgba(155, 0, 255, 0.6)')
    canvasContext.fillStyle = longShotGradient
    canvasContext.fill()
    canvasContext.fillStyle = 'limegreen'
    const textWidthLongShot = canvasContext.measureText('L').width
    canvasContext.fillText('L', longShotPowerUpX - textWidthLongShot / 2, longShotPowerUpY + 20 / 3)

    canvasContext.fillStyle = 'limegreen'
    canvasContext.textAlign = 'right'
    canvasContext.fillText('Shield', canvas.width - 30, shieldPowerUpY + 10)
    canvasContext.fillText('Wide Shot', canvas.width - 30, wideShotPowerUpY + 10)
    canvasContext.fillText('Long Shot', canvas.width - 30, longShotPowerUpY + 10)

    canvasContext.textAlign = 'center'
    canvasContext.fillText('Enemies', canvas.width / 2, 360)
    canvasContext.drawImage(images.asteroid, 30, 400, 40, 40)
    canvasContext.drawImage(images.enemyShip, 30, 460, 40, 40)
    canvasContext.drawImage(images.snakeHead, 30, 520, 40, 40)
    canvasContext.textAlign = 'right'
    canvasContext.fillText('5 PTS', canvas.width - 30, 430)
    canvasContext.fillText('30 PTS', canvas.width - 30, 490)
    canvasContext.fillText('10 PTS', canvas.width - 30, 550)
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
    if (this.player.activeShots.length > 0) this.player.activeShots.forEach(shot => {
      shot.move()
      shot.draw()
    })

    this.player.draw()
  }

  drawScore() {
    canvasContext.textAlign = 'start'
    canvasContext.fillStyle = 'limegreen'
    canvasContext.fillText('Score', 12, 30)
    canvasContext.fillStyle = 'white'
    canvasContext.fillText(this.score, 12, 60)
    canvasContext.textAlign = 'right'
    canvasContext.fillStyle = 'limegreen'
    canvasContext.fillText('Hi-Score', canvas.width - 12, 30)
    canvasContext.fillStyle = 'white'
    canvasContext.fillText(this.highScore, canvas.width - 12, 60)
  }

  drawSpaceshipAnimation() {
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.drawImage(images.background, 0, this.backgroundScrollPosition)
    canvasContext.fillStyle = 'limegreen'
    canvasContext.textAlign = 'center'
    canvasContext.fillText(this.score === 0 ? 'Save earth!' : 'Next round!', canvas.width / 2, canvas.height / 2)
    canvasContext.drawImage(images.playerShip, this.player.x, this.player.y - this.player.height / 2, this.player.width, this.player.height)
    if (this.player.hasShield) {
      const radius = 50
      const x = this.player.x + this.player.width / 2
      const y = this.player.y
      canvasContext.beginPath()
      canvasContext.arc(x, y, radius, 0, Math.PI * 2)
      const gradient = canvasContext.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)')
      gradient.addColorStop(1, 'rgba(0, 0, 255, 0.3)')
      canvasContext.fillStyle = gradient
      canvasContext.fill()
    }
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

    if (this.state === gameStates.asteroidsRound) {
      this.activeAsteroids.forEach(asteroid => asteroid.drawAsteroid())
      if (this.powerUp) this.powerUp.draw()
    }

    if (this.state === gameStates.enemyShipRound) {
      this.enemyShips.forEach(enemy => {
        enemy.handleShots()
        enemy.drawShip()
      })
      if (this.powerUp) this.powerUp.draw()
    }

    if (this.state === gameStates.snakeRound) {
      this.snake.elements.forEach(element => element.draw())
      this.snake.elements[0].handleShots()
      if (this.powerUp) this.powerUp.draw()
    }

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

    if (this.state === gameStates.gameOver) {
      this.drawGameOverScreen()
    }

    requestAnimationFrame(this.drawEverything)
  }

  moveBackground = () => {
    if (this.backgroundScrollPosition < 140) {
      this.backgroundScrollPosition += 2
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
            setTimeout(() => this.switchInfoScreen(), 3000)
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

  addAsteroids() {
    this.asteroids.push(new Asteroid(100, -50, 30, 2.2), new Asteroid(200, -100, 40, 2.4),
        new Asteroid(300, -200, 60, 2.4), new Asteroid(150, -300, 80, 2.4),
        new Asteroid(50, -150, 30, 3), new Asteroid(250, -400, 100, 1.5), new Asteroid(0, -400, 80, 3.5))
  }

  resetAsteroids() {
    this.asteroids.length = 0
    this.addAsteroids()
    this.setActiveAsteroids()
  }

  setActiveAsteroids() {
    this.activeAsteroids = this.asteroids.filter(asteroid => !asteroid.hit)
  }

  addSnakeElements () {
    this.snake.elements.length = 0
    this.snake.elements = [
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
}

let game = new Game()

function setVolume(value) {
  game.setVolume(value)
}

// _______________________________________________________________
// ASTEROIDS
// _______________________________________________________________

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
      game.setActiveAsteroids()
      if (game.respawnAsteroids) this.addNewAsteroid()
    }
  }

  drawAsteroid() {
    if (this.hit) return
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
    if (game.respawnAsteroids) game.asteroids.push(new Asteroid(x,y,this.width, this.speed))
    game.setActiveAsteroids()
  }

  detectCollisionWithShip() {
    if (this.hit || this.countBlocker) return
    const tolerance = 6

    const overlapX = game.player.x + tolerance < this.x + this.width && game.player.x + game.player.width - tolerance > this.x
    const overlapY = game.player.y + tolerance < this.y + this.height && game.player.y + game.player.height - tolerance > this.y

    if (overlapX && overlapY) {
      if (!game.player.hasShield && game.player.isInvincible) {
        this.countBlocker = true
        setTimeout(() => {
          this.hit = true
          game.setActiveAsteroids()
        }, 100)
      }

      if (game.player.hasShield) {
        sounds.shieldDown.play()
        this.countBlocker = true
        game.player.hasShield = false
        game.player.hasLongShot = false
        game.player.hasWideShot = false
        setTimeout(() => {
          this.hit = true
          game.setActiveAsteroids()
        }, 100)
        setTimeout(() => {
          if (!game.player.hasShield) game.player.isInvincible = false
        }, 500)
      }
      else if (!game.player.isInvincible) game.handleGameOver()
    }
  }

  detectCollisionWithShot(shot) {
    const overlapX = shot.x < this.x + this.width && shot.x + shot.width > this.x
    const overlapY = shot.y < this.y + this.height && shot.y + shot.currentHeight > this.y

    if (overlapX && overlapY) {
      if (!this.countBlocker) {
        shot.isActive = false
        game.player.setActiveShots()
        sounds.hitSound.pause()
        sounds.hitSound.currentTime = 0
        sounds.hitSound.play()
        game.score += 5
      }

      this.countBlocker = true

      setTimeout(() => {
        this.hit = true
        game.setActiveAsteroids()
        this.addNewAsteroid()
      }, 100)
    }
  }
}

// _______________________________________________________________
// ENEMY SHIPS
// _______________________________________________________________

class EnemyShip {
  constructor(x,y, isLockOn) {
      this.x = x
      this.y = y
      this.width = 50
      this.height = 50
      this.speed = this.isLockOn ? 3 : 4
      this.lives = game.score > game.minScoreForHardMode ? 4 : 2
      this.isShotCoolDown = false
      this.shotCoolDown = 500
      this.shots = []
      this.activeShots = []
      this.isLockOn = game.score > game.minScoreForHardMode ? isLockOn : false
      this.isLockOnMode = false
  }

  drawShip() {
    if (this.lives >= 1) {
      canvasContext.drawImage(images.enemyShip, this.x, this.y, this.width, this.height)
    }
    if (this.lives % 1 !== 0) {
      canvasContext.drawImage(images.explosion, this.x, this.y, this.width, this.height)
    }
  }

  shoot() {
    if (this.isShotCoolDown || game.player.killed) return

    if (this.x + 40 >= game.player.x && this.x <= game.player.x + 40 && this.lives >= 1) {
      this.shots.push(new EnemyShot(this))
      this.setActiveShots()
      sounds.laserEnemy.play()
    }

    this.isShotCoolDown = true
    setTimeout(() => this.isShotCoolDown = false, this.shotCoolDown)
  }

  setActiveShots() {
    this.activeShots = this.shots.filter(shot => shot.isActive)
  }

  moveShip() {
    if (!this.isLockOnMode && this.isLockOn) {
      this.isLockOnMode = true
      setTimeout(() => this.isLockOnMode = false, 1000)
    }
    if (this.isLockOnMode) {
      if (this.x < game.player.x) this.x += Math.abs(this.speed)
      if (this.x > game.player.x) this.x -= Math.abs(this.speed)
    } else this.x += this.speed

    if (this.x <= 0 || this.x >= canvas.width - 40) {
      this.speed = -this.speed
    }
  }

  handleShots() {
    if (game.player.killed) return
    this.shoot()
    this.activeShots.forEach(shot => {
      shot.draw()
      shot.move()
      shot.detectHittingPlayer()
    })
  }

  detectHitByPlayer(shot) {
    if (this.lives <= 0) return
    const overlapY = shot.y < this.y + this.height && shot.y + shot.currentHeight > this.y
    const overlapX = shot.x < this.x + this.width && shot.x + shot.width > this.x

    if (overlapY && overlapX && this.lives >= 1 && shot.isActive) {
      this.lives -= 0.5
      this.lives <= 0.5 ? sounds.explosion2.play() : sounds.hitSound.play()
      setTimeout(() => this.lives -= 0.5, 100)
      shot.isActive = false
      game.player.setActiveShots()
      game.score += 30
    }
  }
}

class EnemyShot {
  constructor(enemy) {
    this.enemyShip = enemy
    this.width = 10
    this.maxHeightShot = game.score > game.minScoreForHardMode ? 40 : 20
    this.currentShotHeight = 0
    this.x = enemy.x
    this.x2 = enemy.x + 30
    this.y = enemy.y
    this.isActive = true
    this.shotSpeed = 6
    this.shotWidth = 10
  }

  draw() {
    if (this.isActive) {
      if (this.currentShotHeight < this.maxHeightShot) this.currentShotHeight += 2
      canvasContext.fillStyle = 'rgba(255,0,0,0.6)'
      canvasContext.fillRect(this.x, this.y, this.shotWidth, this.currentShotHeight)
      canvasContext.fillRect(this.x2, this.y, this.shotWidth, this.currentShotHeight)
    }
  }

  move() {
    if (this.isActive && this.x + 20 >= game.player.x && this.x <= game.player.x + 20 && this.enemyShip.lives >= 1) {

      sounds.laserEnemy.play()
    }
    if (this.isActive) {
      this.y += this.shotSpeed
    }
    if (this.y > canvas.height) {
      this.isActive = false
      this.enemyShip.setActiveShots()
    }

    this.detectHittingPlayer()
  }

  detectHittingPlayer() {
    if (!this.isActive) return
    const tolerance = 6
    const shotCollisionX = game.player.x + 10 + tolerance < this.x + 30 && game.player.x + 80 - tolerance > this.x + 20
    const shotCollisionX2 = game.player.x + 10 + tolerance < this.x2 + 30 && game.player.x + 80 - tolerance > this.x2 + 20
    const shotCollisionY = game.player.y + tolerance < this.y + 30 && game.player.y + 10 - tolerance > this.y
    const hitByEnemyShot = (shotCollisionX || shotCollisionX2) && shotCollisionY && this.enemyShip.lives >= 1
    if (hitByEnemyShot) {
      if (game.player.hasShield) {
        sounds.shieldDown.play()
        this.currentShotHeight = 0
        this.isActive = false
        this.enemyShip.setActiveShots()
        game.player.hasShield = false
        game.player.hasLongShot = false
        game.player.hasWideShot = false
        setTimeout(() => {
          if (!game.player.hasShield) game.player.isInvincible = false
        }, 500)
      } else if (!game.player.isInvincible) game.handleGameOver()
    }
  }
}

// _______________________________________________________________
// SNAKE
// _______________________________________________________________

class SnakeElement {
  constructor(x,isHead) {
    this.isHead = isHead
    this.x = x
    this.y = 0
    this.size = 40
    this.speed = 8
    this.lives = isHead ? 4 : 1
    this.image = isHead ? images.snakeHead : images.snakeBody
    this.isShotCoolDown = false
    this.shotCoolDown = 750
    this.shots = []
    this.activeShots = []
  }

  draw() {
    canvasContext.fillStyle = '#80008055'
    if (this.lives === 0) {
      canvasContext.fillRect(this.x, this.y + this.size / 2 - 4, this.size, 8)
      return
    }
    canvasContext.filter = `hue-rotate(${game.snake.color}deg)`
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

  shoot() {
    if (!this.isHead || !(game.score > game.minScoreForHardMode) || this.isShotCoolDown || this.x < 0 || this.x > canvas.width - this.size) return
    this.isShotCoolDown = true
    this.shots.push(new EnemyShot(this))
    this.setActiveShots()
    setTimeout(() => this.isShotCoolDown = false, this.shotCoolDown)
  }

  setActiveShots() {
    this.activeShots = this.shots.filter(shot => shot.isActive)
  }

  handleShots() {
    if (game.player.killed) return
    this.shoot()
    this.activeShots.forEach(shot => {
      shot.draw()
      shot.move()
      shot.detectHittingPlayer()
    })
  }

  hitDetection(shot) {
    const overlapY = shot.y < this.y + this.size && shot.y + shot.currentHeight > this.y
    const overlapX = shot.x < this.x + this.size && shot.x + shot.width > this.x
    if (overlapY && overlapX && this.lives > 0.5) {
      shot.isActive = false
      game.player.setActiveShots()
      game.snake.color += 50
      this.lives -= 0.5
      setTimeout(() => this.lives -= 0.5, 100)
      game.score += 10
      setTimeout(() => { game.snake.color -= 50 }, 50)
      sounds.hitSound.pause()
      sounds.hitSound.currentTime = 0
      sounds.hitSound.play()
    }
  }
}

// _______________________________________________________________
// POWER UPS
// _______________________________________________________________

const powerUpTypes = {
  shield: 'Shield power up',
  wideShot: 'Wide shot power up',
  longShot: 'Long shot power up'
}

class PowerUp {
  constructor(type) {
    this.type = type
    this.maxX = canvas.width - 20
    this.minX = 20
    this.x = (Math.random() * (this.maxX - this.minX)) + this.minX
    this.y = -400
    this.radius = 20
    this.speedX = 3
    this.speedY = 3
    this.isActive = true
  }

  draw() {
    if (!this.isActive) return
    canvasContext.beginPath()
    canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    const gradient = canvasContext.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
    gradient.addColorStop(0, this.getGradientByType().step1)
    gradient.addColorStop(1, this.getGradientByType().step2)
    canvasContext.textAlign = 'start'
    canvasContext.fillStyle = gradient
    canvasContext.fill()
    canvasContext.fillStyle = 'limegreen'
    const powerUpLetter = this.type.at(0)
    const textWidth = canvasContext.measureText(powerUpLetter).width
    canvasContext.fillText(powerUpLetter, this.x - textWidth / 2, this.y + this.radius / 3)
  }

  getGradientByType() {
    if (this.type === powerUpTypes.shield) return {
      step1: 'rgba(0, 155, 255, 0.6)',
      step2: 'rgba(0, 0, 255, 0.6)'
    }
    if (this.type === powerUpTypes.wideShot) return {
      step1: 'rgba(255, 155, 0, 0.6)',
      step2: 'rgba(255, 0, 0, 0.6)'
    }
    if (this.type === powerUpTypes.longShot) return {
      step1: 'rgba(0, 0, 255, 0.6)',
      step2: 'rgba(155, 0, 255, 0.6)'
    }
  }

  move() {
    if (this.isActive) {
      this.y += this.speedY
      this.x += this.speedX
      this.x += this.speedX
      if (this.x > canvas.width) this.speedX = -this.speedX
      if (this.x < 0) this.speedX = -this.speedX
    }

    if (this.y > canvas.height) {
      this.isActive = false
    }
  }

  detectCollisionWithPlayer() {
      if (!this.isActive) return
      const closestX = Math.max(game.player.x, Math.min(this.x, game.player.x + game.player.width))
      const closestY = Math.max(game.player.y, Math.min(this.y, game.player.y + game.player.height))

      const distanceX = this.x - closestX
      const distanceY = this.y - closestY

      const distanceSquared = distanceX * distanceX + distanceY * distanceY
      const isCollision = distanceSquared < (this.radius * this.radius)

      if (isCollision) {
        this.isActive = false

        if (this.type === powerUpTypes.shield) {
          if (game.player.hasShield) game.score += 50
          game.player.hasShield = true
          game.player.isInvincible = true
        }

        if (this.type === powerUpTypes.wideShot) {
          if (game.player.hasWideShot) game.score += 50
          game.player.hasWideShot = true
        }

        if (this.type === powerUpTypes.longShot) {
          if (game.player.hasLongShot) game.score += 50
          game.player.hasLongShot = true
        }

        if (this.type === powerUpTypes.shield) {
          sounds.shieldUp.play()
        } else sounds.powerUp.play()
      }
    }
}

// _______________________________________________________________
// SHOTS
// _______________________________________________________________

class Shot {
  constructor(isWideShot, isLongShot) {
    this.isWideShot = isWideShot
    this.isLongShot = isLongShot
    this.width = this.isWideShot ? 30 : 10
    this.fullHeight = this.isLongShot ? 100 : 20
    this.currentHeight = 0
    this.x = game.player.x + game.player.width / 2 - this.width / 2
    this.y = game.player.y
    this.isActive = true
    this.shotSpeed = 10
  }

  move() {
    if (this.isActive) this.y -= this.shotSpeed

    if (this.y <= -20) {
      this.isActive = false
      game.player.setActiveShots()
    }

    if (this.currentHeight < this.fullHeight) {
      this.currentHeight += 2
    }
  }

  draw() {
    let fillColor

    if (!this.isWideShot && !this.isLongShot) fillColor = 'rgba(50, 205, 50, 0.8)'
    if (this.isWideShot && !this.isLongShot) fillColor = 'rgba(255, 0, 0, 0.8)'
    if (!this.isWideShot && this.isLongShot) fillColor = 'rgba(0, 0, 255, 0.8)'
    if (this.isWideShot && this.isLongShot) fillColor = 'rgba(255, 0, 255, 0.8)'

    canvasContext.fillStyle = fillColor

    if (this.isLongShot || this.isWideShot) {
      const lineHeight = 3
      const gap = 3
      const numLines = Math.floor(this.currentHeight / (lineHeight + gap))

      for (let i = 0; i < numLines; i++) {
        const yPosition = this.y + i * (lineHeight + gap)
        canvasContext.fillRect(this.x, yPosition, this.width, lineHeight)
      }
    } else canvasContext.fillRect(this.x, this.y, this.width, this.currentHeight)

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
  if (event.key === 's' && !buttonsPressed.s && game.gameLoaded >= 100) {
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