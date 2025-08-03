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
  bossStructure: './images/shooter/boss-structure.png',
  background: './images/shooter/background.jpg',
  astronaut: './images/shooter/astronaut2.png',
}

const images = {
  playerShip: new Image(),
  snakeHead: new Image(),
  snakeBody: new Image(),
  enemyShip: new Image(),
  asteroid: new Image(),
  explosion: new Image(),
  bossStructure: new Image(),
  background: new Image(),
  astronaut: new Image(),
}

function loadImages() {
    images.snakeHead.onload = () => game.gameLoaded += 5
    images.snakeBody.onload = () => game.gameLoaded += 5
    images.enemyShip.onload = () => game.gameLoaded += 5
    images.bossStructure.onload = () => game.gameLoaded += 5
    images.background.onload = () => game.gameLoaded += 5
    images.playerShip.onload = () => game.gameLoaded += 5
    images.explosion.onload = () => game.gameLoaded += 5
    images.asteroid.onload = () => game.gameLoaded += 3
    images.astronaut.onload = () => game.gameLoaded += 2
    images.snakeHead.src = imageSources.snakeHead
    images.snakeBody.src = imageSources.snakeBody
    images.enemyShip.src = imageSources.enemyShip
    images.bossStructure.src = imageSources.bossStructure
    images.background.src = imageSources.background
    images.playerShip.src = imageSources.playerShip
    images.explosion.src = imageSources.explosion
    images.asteroid.src = imageSources.asteroid
    images.astronaut.src = imageSources.astronaut
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
  bossHitSound: './sounds/shooter/boss-hit2.wav',
  bossAlert: './sounds/shooter/boss-alert.wav',
  spaceshipSound: './sounds/shooter/spaceship-rising.wav',
  loseSound: './sounds/shooter/lose-shooter.wav',
  gameMusic: './sounds/shooter/space-shooter-music.mp3',
  gameMusic2: './sounds/shooter/music2.mp3',
  gameMusic3: './sounds/shooter/music3.mp3',
  shieldUp: './sounds/shooter/shield-up.wav',
  shieldDown: './sounds/shooter/shield-down.wav',
  explosion: './sounds/shooter/explosion.wav',
  explosion2: './sounds/shooter/explosion2.wav',
  thankYou: './sounds/shooter/thank-you.mp3',
}

const sounds = {
  laserEnemy: undefined,
  laser: undefined,
  laser2: undefined,
  laser3: undefined,
  powerUp: undefined,
  hitSound: undefined,
  bossHitSound: undefined,
  bossAlert: undefined,
  spaceshipSound: undefined,
  loseSound: undefined,
  gameMusic: undefined,
  gameMusic2: undefined,
  gameMusic3: undefined,
  shieldUp: undefined,
  shieldDown: undefined,
  explosion: undefined,
  explosion2: undefined,
  thankYou: undefined,
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
  sounds.hitSound.onloadeddata = () => game.gameLoaded += 3
  sounds.bossHitSound = new Audio(soundSources.bossHitSound)
  sounds.bossHitSound.onloadeddata = () => game.gameLoaded += 1
  sounds.bossAlert = new Audio(soundSources.bossAlert)
  sounds.bossAlert.onloadeddata = () => game.gameLoaded += 1
  sounds.spaceshipSound = new Audio(soundSources.spaceshipSound)
  sounds.spaceshipSound.onloadeddata = () => game.gameLoaded += 5
  sounds.loseSound = new Audio(soundSources.loseSound)
  sounds.loseSound.onloadeddata = () => game.gameLoaded += 5
  sounds.gameMusic = new Audio(soundSources.gameMusic)
  sounds.gameMusic.onloadeddata = () => game.gameLoaded += 3
  sounds.gameMusic.loop = true
  sounds.gameMusic2 = new Audio(soundSources.gameMusic2)
  sounds.gameMusic2.onloadeddata = () => game.gameLoaded += 1
  sounds.gameMusic2.loop = true
  sounds.gameMusic3 = new Audio(soundSources.gameMusic3)
  sounds.gameMusic3.onloadeddata = () => game.gameLoaded += 1
  sounds.gameMusic3.loop = true
  sounds.shieldUp = new Audio(soundSources.shieldUp)
  sounds.shieldUp.onloadeddata = () => game.gameLoaded += 5
  sounds.shieldDown = new Audio(soundSources.shieldDown)
  sounds.shieldDown.onloadeddata = () => game.gameLoaded += 5
  sounds.explosion = new Audio(soundSources.explosion)
  sounds.explosion.onloadeddata = () => game.gameLoaded += 2
  sounds.explosion2 = new Audio(soundSources.explosion2)
  sounds.explosion2.onloadeddata = () => game.gameLoaded += 2
  sounds.thankYou = new Audio(soundSources.thankYou)
  sounds.thankYou.onloadeddata = () => game.gameLoaded += 1
}

function playSound(sound) {
  sound.pause()
  sound.currentTime = 0
  sound.play()
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

  resetShots() {
    this.shots = []
    this.setActiveShots()
  }

  draw() {
    if (!this.hasShield && this.isInvincible) {
      canvasContext.filter = 'hue-rotate(180deg) brightness(1.2) saturate(1.5)'
    } else canvasContext.filter = 'none'

    this.killed
        ? canvasContext.drawImage(images.explosion, this.x + (this.height - this.width) / 2, this.y, this.height, this.height)
        : canvasContext.drawImage(images.playerShip, this.x, this.y, this.width, this.height)
    if (!this.hasShield) return
    this.drawShield()
  }

  drawShield() {
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
      this.x -= 3
    }
    if (this.x < 0) {
      this.x = 0
    }

    if (buttonsPressed.d || (gamepadConnected && navigator.getGamepads()[0].buttons[15].pressed )) {
      this.x += 3
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
      shot.playLaserSound()
    }
  }

  losePowerUps() {
    playSound(sounds.shieldDown)
    this.hasShield = false
    this.hasWideShot = false
    this.hasLongShot = false
  }

  handlePlayer() {
    this.move()
    this.moveTouch()
    this.shoot()
    if (this.activeShots.length > 0) this.activeShots.forEach(shot => {
      shot.move()
    })
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
  obstacleRound: 'runs obstacle level',
  snakeRound: 'runs snake level',
  bossRound: 'runs boss level',
  gameOver: 'game is over',
}

const rounds = {
  asteroids: 'asteroid level',
  enemyShips: 'enemy ships level',
  obstacles: 'obstacle level',
  snake: 'snake level',
  boss: 'boss level',
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
  spaceShipAnimation: null,
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
    this.obstacles = null
    this.currentGapPattern = 0
    this.snake = null
    this.dualSnakes = null
    this.boss = null
    this.colorVariable = 0
    this.powerUp = null
    this.level = 1
    this.music = sounds.gameMusic2
  }

  startGame() {
    playSound(sounds.spaceshipSound)
    this.state = gameStates.spaceshipAnimation
  }

  resetGame() {
    this.player.shots.length = 0
    this.player.shotCoolDown = false
    this.resetAsteroids()
    this.snake = new Snake(this.addSnakeElements(),this.colorVariable)
    this.dualSnakes = [
        new Snake(this.addDualSnakes().snake1,this.colorVariable),
        new Snake(this.addDualSnakes().snake2,this.colorVariable)
    ]
    this.boss = new Boss()
    this.player.x = canvas.width / 2 - this.player.width / 2
    this.player.killed = false
    this.player.y = canvas.height - this.player.height
    this.powerUp = null
    this.enemyShips.length = 0
    this.enemyShips.push(new EnemyShip(0,60, false), new EnemyShip(260, 120, true))
    if (this.level > 1) this.enemyShips.push(new EnemyShip(0, 180, false))
    buttonsPressed.a = false
    buttonsPressed.d = false
    buttonsPressed.w = false
    this.backgroundScrollPosition = -1900
  }

  handleGameOver() {
    this.player.killed = true
    window.navigator.vibrate(1000)
    this.round = null
    clearInterval(intervals.enemies)
    clearInterval(intervals.game)
    clearInterval(intervals.background)
    this.music.playbackRate = 0.5
    this.musicRunning  = false
    setTimeout(() => {
      this.music.pause()
    }, 1000)
    playSound(sounds.loseSound)
    setTimeout(() => {
      this.state = gameStates.gameOver
      this.isHighScore = false
      this.gameSpeed = 60
    }, 2000)
  }

  runGame = () => {
    this.player.handlePlayer()
    this.setScore()
  }

  startNextRound() {
    this.resetGame()

    switch (this.round) {
      case null:
        this.respawnAsteroids = true
        this.round = rounds.asteroids
        this.state = gameStates.asteroidsRound
        setTimeout(() => this.respawnAsteroids = false, 12000)
        break
      case rounds.boss:
        this.level += 1
        this.respawnAsteroids = true
        this.round = rounds.asteroids
        this.state = gameStates.asteroidsRound
        if (this.level > 1) this.powerUp = new PowerUp(powerUpTypes.shield)
        setTimeout(() => this.respawnAsteroids = false, 12000)
        break
      case rounds.asteroids:
        this.round = rounds.enemyShips
        this.state = gameStates.enemyShipRound
        if (this.level > 1) this.powerUp = new PowerUp(powerUpTypes.wideShot)
        break
      case rounds.obstacles:
        this.round = rounds.boss
        this.state = gameStates.bossRound
        this.powerUp = new PowerUp(powerUpTypes.longShot)
        break
      case rounds.enemyShips:
        this.round = rounds.obstacles
        this.state = gameStates.obstacleRound

          this.obstacles = new ObstacleLevel(getPattern(this.currentGapPattern))
        break
    }

    intervals.game = setInterval(this.runGame, 1000 / 140)
    intervals.enemies = setInterval(this.runEnemies, 1000 / this.gameSpeed)
    intervals.background = setInterval(game.moveBackground, 1000 / 60)

    if (this.round !== rounds.boss && !this.musicRunning) {
      if (this.music) this.music.pause()
      this.music = this.level === 2 ? sounds.gameMusic3 : sounds.gameMusic2
      playSound(this.music)
      this.musicRunning = true
    }

    if (this.round === rounds.boss) {
      this.music.pause()
      this.music = sounds.gameMusic
      playSound(this.music)
      this.musicRunning = false
      playSound(sounds.bossAlert)
    }
  }

  endLevel() {
    this.player.resetShots()
    clearInterval(intervals.enemies)
    clearInterval(intervals.game)

    setTimeout(() => {
      clearInterval(intervals.background)
      this.state = gameStates.spaceshipAnimation
      intervals.spaceShipAnimation = setInterval(() => this.moveShipForAnimation(), 1000/120)
      playSound(sounds.spaceshipSound)
      if (this.gameSpeed < 100) this.gameSpeed += 2
      canvasContext.fillStyle = 'limegreen'
      canvasContext.fillText('Next round!', 100, canvas.height / 2)
    }, 500)
  }

  runEnemies = () => {
    if (this.powerUp) {
      this.powerUp.move()
      this.powerUp.detectCollisionWithPlayer()
    }

    switch (this.round) {
      case rounds.asteroids:
        this.runAsteroidsLevel()
        break
      case rounds.enemyShips:
        this.runEnemyShipsLevel()
        break
      case rounds.obstacles:
        this.runObstaclesLevel()
        break
      case rounds.boss:
        this.runBossLevel()
        break
      default: break
    }
  }

  runAsteroidsLevel() {
    this.activeAsteroids.forEach(asteroid => {
      asteroid.moveAsteroid()
      asteroid.detectCollisionWithShip()
      this.player.activeShots.forEach(shot => asteroid.detectCollisionWithShot(shot))
    })

    if (this.activeAsteroids.length === 0) {
      this.endLevel()
    }
  }

  runEnemyShipsLevel() {
    this.moveShipEnemies()
    this.enemyShips.forEach(ship => ship.handleShots())
  }

  runObstaclesLevel() {
    this.obstacles.update()
    if (this.obstacles.isOver()) {
      this.score += 100
      this.currentGapPattern += 1
      this.endLevel()
    }
  }

  runBossLevel() {
    if (this.level === 3) {
      if (!this.boss.isActive) setTimeout(() => this.boss.activate(), 3000)
      this.boss.move()
      this.boss.moveObstacles()
      this.boss.handleShots()
      this.boss.elements.forEach(element => this.player.activeShots.forEach(shot => element.hitDetection(shot)))
      if (this.boss.obstacles) this.boss.obstacles.forEach(obstacle => {
        obstacle.detectCollisionWithShip()
        this.player.activeShots.forEach(shot => obstacle.hitDetection(shot))
      })
      const headElement = this.boss.elements.find(element => element.isHead)
      if (headElement.lives <= 0) {
        headElement.shots = []
        headElement.setActiveShots()
        this.boss.elements.forEach((element, index) => {
          setTimeout(() => {
            playSound(sounds.explosion)
            element.lives = 0.5
          }, index * 60)
        })
        game.score += 500
        this.endLevel()
      }
    } else if (this.level === 2) {
      if (!this.dualSnakes.some(snake => snake.isActive)) {
        setTimeout(() => {
          this.dualSnakes.forEach(snake => snake.activate())
        }, 3000)
      }

      this.dualSnakes.forEach(snake => {
        snake.move()
        snake.detectHitByPlayer()
      })

      const snake1IsDead = this.dualSnakes[0].isDead()
      const snake2IsDead = this.dualSnakes[1].isDead()

      if (snake1IsDead) {
        this.dualSnakes[0].runDeathAnimation()
      }

      if (snake2IsDead) {
        this.dualSnakes[1].runDeathAnimation()
      }

      if(snake1IsDead && snake2IsDead) {
        game.score += 250
        this.endLevel()
      }
    } else {
      if (!this.snake.isActive) {
        setTimeout(() => this.snake.activate(), 3000)
      }
      this.snake.move()
      this.snake.detectHitByPlayer()

      if (this.snake.isDead()) {
        this.snake.runDeathAnimation()
        game.score += 150
        this.endLevel()
      }
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
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.textAlign = 'center'
    canvasContext.fillStyle = 'limegreen'
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
    drawPowerUp(50,130,20,powerUpTypes.shield)
    drawPowerUp(50,190,20,powerUpTypes.wideShot)
    drawPowerUp(50,250,20,powerUpTypes.longShot)
    canvasContext.fillStyle = 'limegreen'
    canvasContext.textAlign = 'right'
    canvasContext.fillText('Shield', canvas.width - 30, 130 + 8)
    canvasContext.fillText('Wide Shot', canvas.width - 30, 190 + 8)
    canvasContext.fillText('Long Shot', canvas.width - 30, 250 + 8)

    canvasContext.textAlign = 'center'
    canvasContext.fillText('Enemies', canvas.width / 2, 360)
    canvasContext.drawImage(images.asteroid, 30, 400, 40, 40)
    canvasContext.drawImage(images.enemyShip, 30, 460, 40, 40)
    canvasContext.drawImage(images.snakeHead, 30, 520, 40, 40)
    canvasContext.textAlign = 'right'
    canvasContext.fillText('5 PTS', canvas.width - 30, 430)
    canvasContext.fillText('30 PTS', canvas.width - 30, 490)
    canvasContext.fillText('100 PTS', canvas.width - 30, 550)
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
    canvasContext.drawImage(images.playerShip, this.player.x, this.player.y, this.player.width, this.player.height)
    if (this.player.hasShield) {
      this.player.drawShield()
    }
  }

  moveShipForAnimation() {
    this.player.y -= 3
    if (this.backgroundScrollPosition < 80) this.backgroundScrollPosition += 3
    if (this.player.y < -50) {
      this.startNextRound()
      clearInterval(intervals.spaceShipAnimation)
    }
  }

  drawEverything = () => {
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.drawImage(images.background, 0, this.backgroundScrollPosition)
    this.drawShipAndShot()

    this.drawScore()

    switch (this.state) {
      case gameStates.asteroidsRound:
        this.activeAsteroids.forEach(asteroid => asteroid.drawAsteroid())
        if (this.powerUp) this.powerUp.draw()
        break

      case gameStates.enemyShipRound:
        this.enemyShips.forEach(enemy => {
          enemy.draw()
        })
        if (this.powerUp) this.powerUp.draw()
        break

      case gameStates.obstacleRound:
        this.obstacles.draw()
        break

      case gameStates.bossRound:
        if (this.level === 3) {
          this.boss.draw()
        } else if (this.level === 2) {
          this.dualSnakes.forEach(snake => snake.draw())
          if (this.powerUp) this.powerUp.draw()
        } else {
          this.snake.draw()
          if (this.powerUp) this.powerUp.draw()
        }
        break

      default: break
    }

    this.drawScore()

    switch (this.state) {
      case gameStates.titleScreen:
        this.drawStartScreen()
        break

      case gameStates.spaceshipAnimation:
        this.drawSpaceshipAnimation()
        break

      case gameStates.gameOver:
        this.drawGameOverScreen()
        break

      default: break
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

  addSnakeElements() {
    return [
      new SnakeElement(0,-40, true),
      new SnakeElement(40,-40, false),
      new SnakeElement(80,-40, false),
      new SnakeElement(120,-40, false),
      new SnakeElement(160,-40, false),
      new SnakeElement(200,-40, false),
      new SnakeElement(240,-40, false),
      new SnakeElement(280, -40, false)
    ]
  }

  addDualSnakes() {
    return {
      snake1: [
        new SnakeElement(0,-40, true),
        new SnakeElement(40,-40, false),
        new SnakeElement(80,-40, false),
        new SnakeElement(120,-40, false),
      ],
      snake2: [
        new SnakeElement(canvas.width - 120,- 80, true),
        new SnakeElement(canvas.width - 80,-80, false),
        new SnakeElement(canvas.width - 40,-80, false),
        new SnakeElement(canvas.width, -80, false)
      ]
    }
  }
}

const game = new Game()

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
        game.player.losePowerUps()
        this.countBlocker = true
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
        playSound(sounds.hitSound)
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
      this.lives = game.level > 1 ? 4 : 2
      this.isShotCoolDown = false
      this.shotCoolDown = 500
      this.shots = []
      this.activeShots = []
      this.isLockOn = game.level > 1 ? isLockOn : false
      this.isLockOnMode = false
  }

  draw() {
    if (this.lives >= 1) {
      canvasContext.drawImage(images.enemyShip, this.x, this.y, this.width, this.height)
    }
    if (this.lives % 1 !== 0) {
      canvasContext.drawImage(images.explosion, this.x, this.y, this.width, this.height)
    }
    if (game.player.killed) return
    this.activeShots.forEach(shot => {
      shot.draw()
    })
  }

  shoot() {
    if (this.isShotCoolDown || game.player.killed) return

    if (this.x + 40 >= game.player.x && this.x <= game.player.x + 40 && this.lives >= 1) {
      this.shots.push(new EnemyShot(this))
      this.setActiveShots()
      playSound(sounds.laserEnemy)
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
      playSound(this.lives <= 0.5 ? sounds.explosion2 : sounds.hitSound)
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
    this.maxHeightShot = game.level > 1 ? 40 : 20
    this.currentShotHeight = 0
    this.x = enemy.x
    this.x2 = enemy.x + 30
    this.y = enemy.y
    this.isActive = true
    this.shotSpeed = 4
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
        game.player.losePowerUps()
        this.currentShotHeight = 0
        this.isActive = false
        this.enemyShip.setActiveShots()
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

class Snake {
  constructor(snakeElements, color) {
    this.elements = snakeElements
    this.color = color
    this.isActive = false
    this.blinkingTextStartTime = performance.now()
  }

  activate() {
    this.isActive = true
    this.elements.forEach(element => element.isActive = true)
  }

  move() {
    if (!this.isActive) return
    this.elements.forEach(element => {
      element.move()
      element.handleShots()
    })
  }

  draw() {
    if (!this.isActive) {
      const now = performance.now();
      const blinkElapsed = (now - this.blinkingTextStartTime) % (2 * 550);
      const isVisible = blinkElapsed < 550
      if (isVisible) {
        drawBossWarning(this.blinkingTextStartTime)
      }
    } else this.elements.forEach(element => element.draw())
  }

  detectHitByPlayer() {
    this.elements.forEach(element => {
      game.player.activeShots.forEach(shot => element.hitDetection(shot))
    }
  )}

  isDead() {
    return this.elements.find(element => element.isHead).lives === 0
  }

  runDeathAnimation() {
    this.elements.forEach((element, index) => {
      if (!element.isActive) return
      element.shots = []
      element.setActiveShots()
      setTimeout(() => {
        playSound(sounds.explosion)
        element.lives = 0.5
        if (index === this.elements.length - 1) {
          this.elements.forEach(element => {
            element.lives = 0
            element.isActive = false
          })
        }
      }, index * 60)
    })
  }
}

class SnakeElement {
  constructor(x, y, isHead, regenerates) {
    this.isHead = isHead
    this.x = x
    this.y = y
    this.size = 40
    this.speed = 8
    this.lives = isHead ? 4 : 1
    this.image = isHead ? images.snakeHead : images.snakeBody
    this.isShotCoolDown = false
    this.shotCoolDown = 750
    this.shots = []
    this.activeShots = []
    this.regenerates = regenerates
    this.isActive = false
  }

  draw() {
    canvasContext.fillStyle = '#80008055'
    if (this.lives === 0 && this.isActive) {
      canvasContext.fillRect(this.x, this.y + this.size / 2 - 4, this.size, 8)
      return
    }
    canvasContext.filter = `hue-rotate(${game.colorVariable}deg)`
    if (this.lives > 0.5) {
      canvasContext.drawImage(this.regenerates
          ? images.bossStructure : this.image, this.x, this.y, this.size, this.size)
    }

    if (this.lives % 1 !== 0 && this.isActive) {
      canvasContext.drawImage(images.explosion, this.x, this.y, this.size, this.size)
    }
    canvasContext.filter = 'none'

    if (game.player.killed) return
    if (this.isHead) {
      this.activeShots.forEach(shot => {
        shot.draw()
      })
    }
  }

  move() {
    if (!this.isActive) return
    this.x -= this.speed
    if (this.x < -50 || this.x > 400) {
      this.y += 40
      this.speed = - this.speed
    }

    if (this.lives > 0.5 && this.y >= 450 && this.x < canvas.width - 20) game.handleGameOver()
  }

  moveAsBoss() {
    this.x -= this.speed / 4
    if (this.x <= -120 || this.x > canvas.width + 120) {
      this.speed = -this.speed
      this.y += 5
    }
  }

  shoot() {
    if (!this.isHead || !this.isActive || this.isShotCoolDown || this.x < 0 || this.y < 0 || this.x > canvas.width - this.size) return
    this.isShotCoolDown = true
    this.shots.push(new EnemyShot(this))
    playSound(sounds.laserEnemy)
    this.setActiveShots()
    setTimeout(() => this.isShotCoolDown = false, this.shotCoolDown)
  }

  setActiveShots() {
    this.activeShots = this.shots.filter(shot => shot.isActive)
  }

  handleShots() {
    if (game.player.killed || !this.isHead) return
    this.shoot()
    this.activeShots.forEach(shot => {
      shot.move()
      shot.detectHittingPlayer()
    })
  }

  hitDetection(shot) {
    if (this.y < 0) return
    const overlapY = shot.y < this.y + this.size && shot.y + shot.currentHeight > this.y
    const overlapX = shot.x < this.x + this.size && shot.x + shot.width > this.x
    if (overlapY && overlapX && this.lives > 0.5) {
      shot.isActive = false
      game.player.setActiveShots()
      game.colorVariable += 50
      this.lives -= 0.5
      setTimeout(() => {
        this.lives -= 0.5
        if (!this.isHead && !this.regenerates) game.score += 10
        if (this.lives === 0 && this.regenerates) setTimeout(() => this.lives = 1, 1000)
      }, 100)
      setTimeout(() => { game.colorVariable -= 50 }, 50)
      playSound(this.isHead ? sounds.bossHitSound : sounds.hitSound)
    }
  }
}

// _______________________________________________________________
// DUAL SNAKE
// _______________________________________________________________

// _______________________________________________________________
// BOSS
// _______________________________________________________________

function drawBossWarning(blinkingTextStartTime) {
  const now = performance.now();
  const blinkElapsed = (now - blinkingTextStartTime) % (2 * 550);
  const isVisible = blinkElapsed < 550
  if (isVisible) {
    canvasContext.save()
    canvasContext.fillStyle = 'red'
    canvasContext.font = '32px retro'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('BOSS', canvas.width / 2, canvas.height / 2 - 20)
    canvasContext.fillText('APPROACHES', canvas.width / 2, canvas.height / 2 + 20)
    canvasContext.restore()
  }
}

class Boss2 {
  constructor() {
    this.elements = [
      new SnakeElement(0, 60, false, true), new SnakeElement(canvas.width + 40, 60, false, true), new SnakeElement(canvas.width + 80, 60, false, true),
    ]
  }
}

class Boss {
  constructor() {
    this.elements = [
        new SnakeElement(canvas.width, 60, false, true), new SnakeElement(canvas.width + 40, 60, false, true), new SnakeElement(canvas.width + 80, 60, false, true),
        new SnakeElement(canvas.width, 100, false, true), new SnakeElement(canvas.width + 40, 100, true, false), new SnakeElement(canvas.width + 80, 100, false, true),
        new SnakeElement(canvas.width, 140, false, true), new SnakeElement(canvas.width + 40, 140, false, true), new SnakeElement(canvas.width + 80, 140, false, true),
    ]
    this.obstacles = null
    this.moves = true
    this.bossPosition = 'canvas'
    this.isActive = false
    this.blinkingTextStartTime = performance.now()
  }

  draw() {
    this.elements.forEach(element => element.draw())
    if (this.obstacles) this.obstacles.forEach(obstacle => obstacle.draw())
    const now = performance.now();
    const blinkElapsed = (now - this.blinkingTextStartTime) % (2 * 550);
    const isVisible = blinkElapsed < 550
    if (isVisible && !this.isActive) {
      drawBossWarning(this.blinkingTextStartTime)
    }
  }

  activate() {
    this.isActive = true
    this.elements.forEach(element => element.isActive = true)
  }

  handleShots() {
    this.elements.forEach(element => element.handleShots())
  }

  move() {
    if (!this.isActive) return
    if (!this.moves && this.obstacles !== null) return
    this.elements.forEach(element => element.moveAsBoss())
    const isLeftOutbound = !this.elements.some(element => element.x > - 50)
    const isRightOutbound = !this.elements.some(element => element.x < canvas.width + 10)
    if (this.bossPosition !== 'right-outbound' && isRightOutbound) {
      this.bossPosition = 'right-outbound'
      this.moves = false
      this.setObstacles()
    }
    else if (this.bossPosition !== 'left-outbound' && isLeftOutbound) {
      this.bossPosition = 'left-outbound'
      this.moves = false
      this.setObstacles()
    }
  }

  setObstacles() {
    const randomIndex = Math.floor(Math.random() * 9)
    this.obstacles = [
        [new Obstacle(0,-40, true), new Obstacle(0,-80, true), new Obstacle(0,-120, true), new Obstacle(0,-160, true)],
        [new Obstacle(40,-40, true), new Obstacle(40,-80, true), new Obstacle(40,-120, true), new Obstacle(40,-160, true)],
        [new Obstacle(80,-40, true), new Obstacle(80,-80, true), new Obstacle(80,-120, true), new Obstacle(80,-160, true)],
        [new Obstacle(120,-40, true), new Obstacle(120,-80, true), new Obstacle(120,-120, true), new Obstacle(120,-160, true)],
        [new Obstacle(160,-40, true), new Obstacle(160,-80, true), new Obstacle(160,-120, true), new Obstacle(160,-160, true)],
        [new Obstacle(200,-40, true), new Obstacle(200,-80, true), new Obstacle(200,-120, true), new Obstacle(200,-160, true)],
        [new Obstacle(240,-40, true), new Obstacle(240,-80, true), new Obstacle(240,-120, true), new Obstacle(240,-160, true)],
        [new Obstacle(280,-40, true), new Obstacle(280,-80, true), new Obstacle(280,-120, true), new Obstacle(280,-160, true)],
        [new Obstacle(320,-40, true), new Obstacle(320,-80, true), new Obstacle(320,-120, true), new Obstacle(320,-160, true)],
        [new Obstacle(360,-40, true), new Obstacle(360,-80, true), new Obstacle(360,-120, true), new Obstacle(360,-160, true)],
    ]
    this.obstacles[randomIndex].forEach(entry => entry.isActive = false)
    this.obstacles[randomIndex + 1].forEach(entry => entry.isActive = false)
    this.obstacles = this.obstacles.flat()
  }

  moveObstacles() {
    if (this.moves) return
    this.obstacles.forEach(obstacle => obstacle.move())
    if (!this.obstacles.some(obstacle => obstacle.y < canvas.height)) {
      this.moves = true
      this.obstacles = null
    }
  }
}

// _______________________________________________________________
// OBSTACLE
// _______________________________________________________________

class Obstacle {
  constructor(x, y, isActive) {
    this.x = x
    this.y = y
    this.isActive = isActive
    this.speedY = 4
    this.size = canvas.width / 10
    this.lives = 1
  }

  draw() {
    if (!this.isActive) return
    canvasContext.filter = `hue-rotate(${game.colorVariable}deg)`
    if (this.lives > 0.5) {
      canvasContext.drawImage(images.bossStructure, this.x, this.y, this.size, this.size)
    }

    if (this.lives % 1 !== 0) {
      canvasContext.drawImage(images.explosion, this.x, this.y, this.size, this.size)
    }
    canvasContext.filter = 'none'
  }

  move() {
    this.y += this.speedY
  }

  hitDetection(shot) {
    if (!this.isActive) return
    const overlapY = shot.y < this.y + this.size && shot.y + shot.currentHeight > this.y
    const overlapX = shot.x < this.x + this.size && shot.x + shot.width > this.x
    if (overlapY && overlapX && this.lives > 0.5) {
      shot.isActive = false
      game.player.setActiveShots()
      game.colorVariable += 50
      this.lives -= 0.5
      setTimeout(() => {
        this.lives -= 0.5
        this.isActive = false
      }, 100)
      setTimeout(() => { game.colorVariable -= 50 }, 50)
      playSound(sounds.hitSound)
    }
  }

  detectCollisionWithShip() {
    if (!this.isActive) return
    const tolerance = 6

    const overlapX = game.player.x + tolerance < this.x + this.size && game.player.x + game.player.width - tolerance > this.x
    const overlapY = game.player.y + tolerance < this.y + this.size && game.player.y + game.player.height - tolerance > this.y

    if (overlapX && overlapY) {
      if (!game.player.hasShield && game.player.isInvincible) {
        this.isActive = false
        return
      }
      if (game.player.hasShield) {
        game.player.losePowerUps()
        this.isActive = false
        setTimeout(() => {
          if (!game.player.hasShield) game.player.isInvincible = false
        }, 500)
        game.player.isInvincible = true
      } else if (!game.player.isInvincible) {
        game.handleGameOver()
      }
    }
  }
}

// _______________________________________________________________
// OBSTACLE LEVEL
// _______________________________________________________________

const getPattern = (oldPattern) => {
  if (oldPattern === 1) return gapPattern2
  else if (oldPattern === 2) return gapPattern3
  else return gapPattern
}

const gapPattern = [
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,2,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,0,0,1],
    [1,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,0,2,0,1],
    [1,1,1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,2,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
]

const gapPattern2 = [
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,2,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,2,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,2,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,1],
    [1,1,1,1,1,1,0,0,0,1],
    [1,1,1,1,1,0,0,0,1,1],
    [1,1,1,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,0,1]
]

const gapPattern3 = [
    [0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,1,1,0,0,0,1],
    [1,0,0,0,1,1,0,0,0,1],
    [1,0,0,0,1,1,0,2,0,1],
    [1,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,2,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,0,2,0,1],
    [1,1,1,1,0,0,0,0,0,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,1],
    [1,1,1,1,1,1,0,0,0,1],
    [1,1,1,1,1,0,0,0,1,1],
    [1,1,1,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,2,1,1,1],
    [1,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,0,0,0,0,1,1,1]
]

class Collectible {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speedY = 4
    this.size = canvas.width / 10
    this.isCollected = false
  }

  draw() {
    if (this.isCollected) return
    canvasContext.drawImage(images.astronaut, this.x, this.y, this.size, this.size)
  }

  move() {
    this.y += this.speedY
  }

  detectCollisionWithShip() {
    if (this.isCollected) return
    const tolerance = 6

    const overlapX = game.player.x + tolerance < this.x + this.size && game.player.x + game.player.width - tolerance > this.x
    const overlapY = game.player.y + tolerance < this.y + this.size && game.player.y + game.player.height - tolerance > this.y

    if (overlapX && overlapY) {
      this.isCollected = true
      game.score += 100
      playSound(sounds.thankYou)
    }
  }

  hitDetection() {}
}

class ObstacleLevel {
    constructor(pattern) {
        this.pattern = pattern
        this.currentRow = 0
        this.activeObstacles = []
        this.obstacleSize = canvas.width / 10
        this.y = -80
    }

    update() {
        this.y -= this.obstacleSize
        if (this.currentRow < this.pattern.length) {
            const row = this.pattern[this.currentRow];
            row.forEach((cell, col) => {
                if (cell === 1) {
                    this.activeObstacles.push(
                        new Obstacle(
                            col * this.obstacleSize,
                            this.y,
                            true
                        )
                    );
                }
                if (cell === 2) {
                  this.activeObstacles.push(
                      new Collectible(col * this.obstacleSize, this.y)
                  )
                }
            })
            this.currentRow++
        }

        this.activeObstacles.forEach(obs => obs.move())

        this.activeObstacles = this.activeObstacles.filter(obs => obs.y < canvas.height + 40)

        this.handleCollisions()
    }

    handleCollisions() {
        this.activeObstacles.forEach(o => o.detectCollisionWithShip())
        game.player.activeShots.forEach(shot => {
            this.activeObstacles.forEach(obs => obs.hitDetection(shot))
        })
    }

    draw() {
        this.activeObstacles.forEach(obs => { if(obs.y >= -20) obs.draw()})
    }

    isOver() {
        return game.player.y + game.player.height < this.activeObstacles[this.activeObstacles.length - 1].y
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

function drawPowerUp(x, y, radius, type) {
  canvasContext.save()
  canvasContext.beginPath()
  canvasContext.arc(x, y, radius, 0, Math.PI * 2)

  const gradient = canvasContext.createRadialGradient(x,y,0,x,y,radius)
  const gradientColors = getGradientByType(type)
  gradient.addColorStop(0, gradientColors.step1)
  gradient.addColorStop(1, gradientColors.step2)

  canvasContext.fillStyle = gradient
  canvasContext.fill()

  const powerUpLetter = type.at(0)

  canvasContext.font = `${radius}px retro`
  canvasContext.textAlign = 'center'
  canvasContext.textBaseline = 'middle'
  canvasContext.fillStyle = 'limegreen'
  canvasContext.fillText(powerUpLetter, x, y)
  canvasContext.restore()
}

function getGradientByType(type) {
  if (type === powerUpTypes.shield) return {
    step1: 'rgba(0, 155, 255, 0.6)',
    step2: 'rgba(0, 0, 255, 0.6)'
  }
  if (type === powerUpTypes.wideShot) return {
    step1: 'rgba(255, 155, 0, 0.6)',
    step2: 'rgba(255, 0, 0, 0.6)'
  }
  if (type === powerUpTypes.longShot) return {
    step1: 'rgba(0, 0, 255, 0.6)',
    step2: 'rgba(155, 0, 255, 0.6)'
  }
}

class PowerUp {
  constructor(type) {
    this.type = type
    this.maxX = canvas.width - 20
    this.minX = 20
    this.x = (Math.random() * (this.maxX - this.minX)) + this.minX
    this.y = -800
    this.baseRadius = 20
    this.radius = 20
    this.pulseTime = 0
    this.pulseSpeed = 0.07
    this.pulseRange = 3
    this.speedX = 3
    this.speedY = 3
    this.isActive = true
  }

  draw() {
    if (!this.isActive) return
    this.pulseTime += this.pulseSpeed
    this.radius = this.baseRadius + Math.sin(this.pulseTime) * this.pulseRange
    drawPowerUp(this.x,this.y,this.radius,this.type)
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

        playSound(this.type === powerUpTypes.shield ? sounds.shieldUp : sounds.powerUp)
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
    this.shotSpeed = 6
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

  playLaserSound() {
      let sound
      if (game.player.hasWideShot && game.player.hasLongShot) sound = sounds.laser3
      else if (game.player.hasWideShot || game.player.hasLongShot) sound = sounds.laser2
      else sound = sounds.laser
      playSound(sound)
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
    game.state = gameStates.spaceshipAnimation
    intervals.spaceShipAnimation = setInterval(() => game.moveShipForAnimation(), 1000/120)
    buttonsPressed.s = true
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
    intervals.spaceShipAnimation = setInterval(() => game.moveShipForAnimation(), 1000/120)
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