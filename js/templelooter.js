/*
###########################
GENERAL ELEMENTS AND DATA
###########################
 */

const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')
const canvasWidth = canvas.width
const canvasHeight = canvas.height

const overlay = document.getElementById('damage-overlay')

const buttonsPressed = {
    a: false,
    s: false,
    w: false,
    d: false,
}

const sounds = {
    death: { src: document.getElementById("death"), playOnce: true },
    start: { src: document.getElementById("start-sound"), playOnce: true },
    gameOver: { src: document.getElementById("gameover-sound"), playOnce: true },
    treasure: { src: document.getElementById("treasure-sound"), playOnce: false },
    key: { src: document.getElementById("key-sound"), playOnce: false },
    gate: { src: document.getElementById("gate-sound"), playOnce: false },
    hurt: { src: document.getElementById("hurt-sound"), playOnce: true },
    victory: { src: document.getElementById("victory-sound"), playOnce: true },
    bat: { src: document.getElementById("bat-sound"), playOnce: true },
    drums: { src: document.getElementById("drum-sound"), playOnce: true },
}

const sprites = {
    player1: document.getElementById('character1'),
    player2: document.getElementById('character2'),
    bat1: document.getElementById('bat1'),
    bat2: document.getElementById('bat2'),
    backgrounds: {
        ruin: document.getElementById('background'),
        lava1: document.getElementById('lava-background1'),
        lava2: document.getElementById('lava-background2'),
    },
    items: {
        treasure: document.getElementById('treasure'),
        key: document.getElementById('key'),
        wall: document.getElementById('wall'),
        bridge: document.getElementById('bridge'),
    }
}

/*
###########################
GAME DATA
###########################
 */

const intervals = {
    player: null,
    bat: null,
    game: null,
    key: null,
    lavaBackground: null
}

const states = {
    notStarted: 'game was not started yet',
    wallLevel: 'obstacle wall and one bat',
    batLevel: 'level with too many bats',
    lavaLevel: 'bridges over lava level',
    nextRoundMessage: 'next round message is being displayed',
    gameOverMessage: 'game over message is being displayed',
    victoryMessage: 'victory message is being displayed'
}

const gameState = {
    keysRequired: 5,
    gameOver: false,
    gameSpeed: 120,
    round: 1,
    volume: 1,
    state: states.notStarted,
    randomNumber: null,
    batState1: true,
    batSprite: sprites.bat1,
    backgroundLavaLevel: sprites.backgrounds.lava1,
    background1Lava: true,
}

const player1 = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    characterSprite: '',
    sprite1: true,
    invincibility: false,
    keys: 0,
    isCollision: {
        x: false,
        y: false,
    },
    passedGate: false,
    score: 0,
    lives: 3,
    gatesPassed: 0,
    carriedByBridge: false,
    blockMovementLeft: false,
    kickback: {
        x: 0,
        y: 0,
    }
}

const enemies = {
    obstacle: {
        x: canvasWidth + 200,
        y: 0,
        y2: 0,
        width: 30,
        height: 0
    },
    bats: [
            {
                x: 700,
                y: 100,
                width: 50,
                height: 30,
                distanceX: 0,
                distanceY: 0,
                speedX: 0.5,
                speedY: 0.5
            },
        {
            x: 700,
            y: 400,
            width: 50,
            height: 30,
            distanceX: -30,
            distanceY: 10,
            speedX: 0.5,
            speedY: 0.8
        },
        {
            x: 500,
            y: 100,
            width: 50,
            height: 30,
            distanceX: 30,
            distanceY: 10,
            speedX: 0.8,
            speedY: 0.5
        },
    ],
    randomBats: [
        {
            x: 200,
            y: 200,
            width: 50,
            height: 30,
            multiplierX: 1,
            multiplierY: 1
        },
        {
            x: 300,
            y: 50,
            width: 50,
            height: 30,
            multiplierX: -1,
            multiplierY: 1
        },
    ]
}

const items = {
    treasure: {
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        collectMessage: "LOOT!",
        messagteState: false,
        collected: false,
        coolDown: false,
    },
    key: {
        x: 0,
        y: 0,
        collectMessage: "KEY!",
        messageState: false,
        collected: false,
        showKey: false,
    },
    bridge1: {
        x: 84,
        y: 100,
        width: 100,
        height: 50
    },
    bridge2: {
        x: 192,
        y: 700,
        width: 100,
        height: 50
    },
}

/*
###########################
GAME LOGIC
###########################
 */

function movePlayer() {
    const gamepad1Connected = navigator.getGamepads()[0] !== null

    if (gamepad1Connected) {
        movePlayerGamepad()
    }

    if (buttonsPressed.a && player1.x > 0) {
        player1.x > enemies.obstacle.x + enemies.obstacle.width && player1.x < enemies.obstacle.x + enemies.obstacle.width
            ? player1.x = enemies.obstacle.x + enemies.obstacle.width
            : player1.x -= 2
    }

    if (buttonsPressed.d && player1.x < 9 * canvasWidth / 10 && !player1.isCollision.x) {
        player1.x += 2
    }

    if (buttonsPressed.w && player1.y > 25) {
        player1.y -= 2
    }

    if (buttonsPressed.s && player1.y < 9 * canvasHeight / 10) {
        player1.y += 2
    }

    if (player1.isCollision.x) {
        player1.x += player1.kickback.x
        player1.kickback.x -= 1
        if (player1.kickback.x === -12 || player1.kickback.x === 12) {
            player1.isCollision.x = false
            player1.kickback.x = 0
        }
    }

    if (player1.isCollision.y) {
        player1.y += player1.kickback.y
        player1.kickback.y += 1
        if (player1.kickback.y === 6 || player1.kickback.y === -6) {
            player1.isCollision.y = false
            player1.kickback.y = 0
        }
    }
}

function movePlayerTouch() {
    if (touchControls.active) {
        if (touchControls.x - 80 < player1.x) {
            player1.x -= 2
            if (player1.x < 0) {
                player1.x = 0
            }
        }

        if (touchControls.x -80 > player1.x) {
            player1.x += 2
            if (player1.x > canvasWidth) {
                player1.x = canvasWidth - 10
            }
        }

        if (touchControls.y -150 < player1.y) {
            player1.y -= 2
            if (player1.y < 0) {
                player1.y = 0
            }
        }

        if (touchControls.y -150 > player1.y) {
            player1.y += 2
            if (player1.y > canvasHeight - 20) {
                player1.y = canvasHeight - 20
            }
        }
    }
}

function changeTouchPosition(event) {
    touchControls.active = true
    touchControls.x = event.targetTouches ? event.targetTouches[0].pageX - overlay.offsetLeft : event.offsetX
    touchControls.y = event.targetTouches ? event.targetTouches[0].pageY - overlay.offsetTop : event.offsetY
}

function movePlayerGamepad() {
    if (navigator.getGamepads()[0].buttons[14].pressed && player1.x > 0) {
        if (player1.x > enemies.obstacle.x + enemies.obstacle.width && player1.x < enemies.obstacle.x + enemies.obstacle.width) {
            player1.x = enemies.obstacle.x + enemies.obstacle.width
        } else {
            player1.x -= 2
        }
    }

    if (navigator.getGamepads()[0].buttons[15].pressed && player1.x < 9 * canvasWidth / 10 && !player1.isCollision.x) {
        player1.x += 2
    }

    if (navigator.getGamepads()[0].buttons[12].pressed && player1.y > 25) {
        player1.y -= 2
    }

    if (navigator.getGamepads()[0].buttons[13].pressed && player1.y < 9 * canvasHeight / 10) {
        player1.y += 2
    }
}

function resetPlayerPosition() {
    player1.x = 0
    player1.y = canvasHeight / 2
}

function handlePlayer() {
    movePlayerTouch()
    movePlayer()
    collision()
}

function animateCharacter() {
    player1.sprite1 = !player1.sprite1
    player1.characterSprite = player1.sprite1 ? sprites.player2 : sprites.player1
}

function handleInvincibility() {
    if (!player1.invincibility) {
        player1.lives -= 1
        overlay.style.opacity = 0.3
        player1.invincibility = true
        setTimeout(function() {
            overlay.style.opacity = 0
        }, 200)
        setTimeout(function () {
            player1.invincibility = false
        }, 700)
    }
}

function collision() {
    if (enemies.obstacle.x < player1.x + player1.width && enemies.obstacle.x >= player1.x + player1.width - 4) {
        if ((player1.y < enemies.obstacle.y + enemies.obstacle.height - 10) || (enemies.obstacle.y2 < player1.y + player1.height)) {
            playSound(sounds.hurt)
            player1.isCollision.x = true
            player1.kickback.x = -4
        }

    }
    
    if (player1.x < enemies.obstacle.x + enemies.obstacle.width && player1.x + player1.width > enemies.obstacle.x) {
        if (player1.y <= enemies.obstacle.y + enemies.obstacle.height && player1.y >= enemies.obstacle.y + enemies.obstacle.height - 2) {
                player1.isCollision.y = true
            player1.kickback.y = 4
        }

        if (player1.y < enemies.obstacle.y2 + 2 && player1.y + player1.height > enemies.obstacle.y2) {
                player1.isCollision.y = true
            player1.kickback.y = -4
        }
    }

    if (player1.passedGate) {
        if (player1.x < enemies.obstacle.x + enemies.obstacle.width) {
            player1.x = enemies.obstacle.x + enemies.obstacle.width
        }
    }
}

function keyStatusToggle() {
    items.key.showKey = true
    items.key.collected = false
    items.key.x = 20 + Math.floor(Math.random() * 300)
    items.key.y = 25 + Math.floor(Math.random() * 300)
}

function collectKey() {
    if (player1.x < items.key.x + 40 && player1.x + player1.width > items.key.x && player1.y < items.key.y + 25 && player1.y + player1.height > items.key.y && !items.key.collected) {
        playSound(sounds.key)
        player1.keys += 1
        items.key.collected = true
        items.key.messageState = true
        setTimeout(() => items.key.messageState = false, 500)
    }
}

function collectTreasure() {
    if (player1.x < items.treasure.x + items.treasure.width && player1.x + player1.width > items.treasure.x &&
        player1.y < items.treasure.y + items.treasure.height && player1.y + player1.height > items.treasure.y &&
        !items.treasure.collected) {
        playSound(sounds.treasure)
        items.treasure.collected = true
        player1.score += 20
        items.treasure.messageState = true
        setTimeout (() => items.treasure.messageState = false, 500)
        if (gameState.round === 2 && items.treasure.collected && !items.treasure.coolDown) {
            items.treasure.coolDown = true
            setTimeout(function () {
                items.treasure.x = 20 + Math.floor(Math.random() * 200)
                items.treasure.y = 20 + Math.floor(Math.random() * 350)
                items.treasure.collected = false
                items.treasure.coolDown = false
            }, 500)
        }
    }
}

function moveWall() {
    enemies.obstacle.y2 = enemies.obstacle.height + 60
    enemies.obstacle.x -= 1

    if (enemies.obstacle.x < -30) {
        enemies.obstacle.x = canvasWidth + 50
        enemies.obstacle.height = 25 * Math.floor(Math.random() * 10) + 25
        player1.passedGate = false
        items.treasure.x = 25 + Math.floor(Math.random() * 200)
        items.treasure.y = 25 + Math.floor(Math.random() * 300)
        items.treasure.collected = false
    }
}

function moveBat(bat) {
    let divisor = 1
    if(gameState.randomNumber > 0.6){
        divisor = 2
    }
    if (bat.x < player1.x + bat.distanceX) {
    bat.x += bat.speedX / divisor
    }

    if (bat.x > player1.x + bat.distanceX) {
        bat.x -= bat.speedX / divisor
    }

    if (bat.y < player1.y + bat.distanceY) {
        bat.y += bat.speedY / divisor
    }

    if (bat.y > player1.y + bat.distanceY) {
        bat.y -= bat.speedY / divisor
    }
    batCollision(bat)
}

function animateBat() {
    gameState.batState1 = !gameState.batState1
    gameState.batSprite = gameState.batState1 ? sprites.bat1 : sprites.bat2
}

function batCollision(bat) {
    if (player1.x + 15 < bat.x + 35 && player1.x + player1.width > bat.x + 15 && player1.y + 10 <= bat.y + 20 && player1.y + player1.height >= bat.y && !player1.invincibility) {
        playSound(sounds.hurt)
        playSound(sounds.bat)
        handleInvincibility()
    }
}

function randomGenerator() {
    gameState.randomNumber = Math.random()
}

function moveBatByRandom(bat) {
    if (gameState.randomNumber < 0.4) {
        bat.x += 1 * bat.multiplierX
        bat.y += 1 * bat.multiplierY
    } else if (gameState.randomNumber >= 0.4 && gameState.randomNumber < 0.6) {
        bat.x += 0.8 * bat.multiplierX
        bat.y -= 1 * bat.multiplierY
    } else if (gameState.randomNumber >= 0.6 && gameState.randomNumber < 0.8) {
        bat.x -= 1 * bat.multiplierX
        bat.y -= 0.8 * bat.multiplierY
    } else {
        bat.x -= 1 * bat.multiplierX
        bat.Y += 1 * bat.multiplierY
    }

    if (bat.x > canvasWidth - 30) {
        bat.x = canvasWidth - 30
    }

    if (bat.x < 20) {
        bat.x = 20
    }

    if (bat.y > canvasHeight - 30) {
        bat.y = canvasHeight - 30
    }

    if (bat.y < 20) {
        bat.y = 20
    }

    batCollision(bat)
}

function runWallLevel() {
    raiseSpeed()
    collectTreasure()
    collectKey()
    moveWall()
    handlePlayer()
    moveBat(enemies.bats[0])
    endGame()
    nextRound()
}

function runBatLevel() {
    collectTreasure()
    handlePlayer()
    collectKey()
    enemies.bats.forEach(bat => moveBat(bat))
    enemies.randomBats.forEach(bat => moveBatByRandom(bat))
    endGame()
    nextRound()
}

function runLavaLevel() {
    moveBridges()
    movePlayer()
    movePlayerTouch()
    removeShadow()
    drawScoreBoard()
    endGame()
    nextRound()
    bridgeCollision(items.bridge1,1,100)
    bridgeCollision(items.bridge2,-1.2,-100)
    lavaCollision()
    winGame()
    player1.carriedByBridge = false
}

function toggleBackground() {
    gameState.background1Lava = !gameState.background1Lava
    gameState.backgroundLavaLevel = (gameState.background1Lava === true) ? sprites.backgrounds.lava1 : sprites.backgrounds.lava2
}

function endGame() {
    if (player1.x + player1.width < -30 || player1.lives === 0) {
        player1.lives = 0
        gameState.gameSpeed = 10
        playSound(sounds.death)
        clearInterval(intervals.game)

        switch (gameState.round) {
            case 1: {
                intervals.game = setInterval(runWallLevel, 1000 / gameState.gameSpeed)
                break
            }
            case 2: {
                intervals.game = setInterval(runBatLevel, 1000 / gameState.gameSpeed)
                break
            }
            case 3: {
                intervals.game = setInterval(runLavaLevel, 1000 / gameState.gameSpeed)
                break
            }
        }

        if (!gameState.gameover) {
            pauseSound(sounds.drums)
            gameState.gameover = true
            setTimeout(function () {
                gameState.round = 1
                touchBTNStart.disabled = false
                touchBTNStart.style.display = 'block'
                clearInterval(intervals.game)
                playSound(sounds.gameOver)
                gameState.state = states.gameOverMessage
            }, 1000)
        }
    }
}

function nextRound() {
    if (player1.keys === gameState.keysRequired) {
        pauseSound(sounds.drums)
        touchControls.active = false
        gameState.round += 1
        gameState.state = states.nextRoundMessage
        clearInterval(intervals.game)
        initialize()
        playSound(sounds.start)
        setTimeout(() => {
            playSound(sounds.drums)
            if (gameState.round === 2) {
                gameState.state = states.batLevel
                intervals.game = setInterval(runBatLevel, 1000 / gameState.gameSpeed)
            }
            if (gameState.round === 3) {
                gameState.state = states.lavaLevel
                intervals.game = setInterval(runLavaLevel, 1000 / gameState.gameSpeed)
                intervals.lavaBackground = setInterval(toggleBackground, 1000)
            }
        }, 2000)
    }
}

function raiseSpeed() {
    if (player1.x > enemies.obstacle.x + 10 && !player1.passedGate) {
        player1.gatesPassed += 1
        playSound(sounds.gate)
        player1.passedGate = true
    }
    if (player1.gatesPassed === 4) {
        player1.gatesPassed = 0
        gameState.gameSpeed = 1.1 * gameState.gameSpeed
        clearInterval(intervals.game)
        intervals.game = setInterval(runWallLevel, 1000 / gameState.gameSpeed)
    }
}

function moveBridges() {
    items.bridge1.y < canvasHeight + 200 ? items.bridge1.y += 1 : items.bridge1.y = -200
    items.bridge2.y > -200 ? items.bridge2.y -= 1.2 : items.bridge2.y = 700
}

function lavaCollision() {
    if (player1.x > 60 && !player1.carriedByBridge && player1.x < 260 || player1.y > canvasHeight + 20 || player1.y < -20) {
        player1.lives -= 1
        overlay.style.opacity = 0.3
        setTimeout(function() {
            overlay.style.opacity = 0
            }, 200)

        if (player1.lives >= 1 && !player1.blockMovementLeft){
            player1.blockMovementLeft = true
            setTimeout(()=> { player1.blockMovementLeft = false }, 500)
        }
        playSound(sounds.hurt)
    }

    if (player1.blockMovementLeft){
        resetPlayerPosition()
    }
}

function bridgeCollision(bridge, moveY, secondBridgeY) {
    if (bridge.x < player1.x + player1.width && bridge.x + bridge.width > player1.x) {
        if (
            (player1.y + player1.height - 10 < bridge.y + bridge.height - 10 && bridge.y < player1.y + player1.height) || 
            (player1.y + player1.height - 10 < bridge.y + secondBridgeY + bridge.height - 10 && bridge.y + secondBridgeY < player1.y + player1.height)
        ) {
            player1.carriedByBridge = true
        }
    }
    
    if (bridge.x < player1.x + player1.width / 2 && bridge.x + bridge.width > player1.x + player1.width / 2) {
        player1.y += moveY
    } 
}

let jumpUp = true
let characterJump = 0

function jumpingPlayerAnimation() {
    animateCharacter()
    player1.y += characterJump

    if (jumpUp) {
        jumpUp = characterJump < 4
        characterJump += 1
    }
    
    if (!jumpUp) {
        characterJump -= 1
        jumpUp = characterJump < -4
    }
    
    player1.y = player1.y > 200 ? 200 : player1.y
}

let gameWon = false

function winGame() {
    if (player1.x > 280 && player1.y > 140 && player1.y < 200 && !gameWon) {
        pauseSound(sounds.drums)
        playSound(sounds.victory)
        gameWon = true
        player1.score += 500
        clearInterval(intervals.game)
        intervals.game = setInterval(() => {
            runVictoryAnimation()
        }, 1000 / 60)
        setTimeout(() => {
            gameState.state = states.victoryMessage
        }, 2000)
    }
}

function runVictoryAnimation() {
    jumpingPlayerAnimation()
}

/*
###########################
DRAWING LGOIC
###########################
 */

function drawBridges() {
    ctx.drawImage(sprites.items.bridge, items.bridge1.x, items.bridge1.y, items.bridge1.width, items.bridge1.height)
    ctx.drawImage(sprites.items.bridge, items.bridge1.x, items.bridge1.y + 100, items.bridge1.width, items.bridge1.height)
    ctx.drawImage(sprites.items.bridge, items.bridge2.x, items.bridge2.y, items.bridge2.width, items.bridge2.height)
    ctx.drawImage(sprites.items.bridge, items.bridge2.x, items.bridge2.y - 100, items.bridge2.width, items.bridge2.height)
}

function drawVictoryScreen() {
    clearInterval(intervals.game)
    blackBackground()
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.font = '30px pixelFont'
    ctx.fillText('You win!', canvasWidth / 2, canvasHeight / 2)
    ctx.font = '24px pixelFont'
    ctx.fillText('Your score: ' + player1.score, canvasWidth / 2, canvasHeight / 2 + 60)
}

function drawNextRoundScreen() {
    blackBackground()
    ctx.fillStyle = 'white'
    ctx.font = '30px pixelFont'
    ctx.textAlign = 'center'
    ctx.fillText('Next round!', canvasWidth / 2, canvasHeight / 2)
}

function drawGameOverScreen() {
    blackBackground()
    ctx.fillStyle = 'white'
    ctx.font = '30px pixelFont'
    ctx.textAlign = 'center'
    ctx.fillText('Game Over', canvasWidth / 2, canvasHeight / 2 - 50)
    ctx.font = '20px pixelFont'
    ctx.fillText('Your score: ' + player1.score, canvasWidth / 2, canvasHeight / 2 + 50)
    ctx.fillText('Hit Start for retry', canvasWidth / 2, canvasHeight / 2 + 100)
}

function drawIntroMessage() {
    blackBackground()
    ctx.fillStyle = "white"
    ctx.font = '30px pixelFont'
    ctx.textAlign = 'center'
    ctx.fillText("Get ready", canvasWidth / 2, canvasHeight / 2)
}

function drawLives() {
    ctx.fillStyle = 'red'
    ctx.font = '30px pixelFont'

    switch (player1.lives) {
        case 0:
            text = '♡♡♡'
            break
        case 1:
            text = '❤♡♡'
            break
        case 2:
            text = '❤❤♡'
            break
        default:
            text = '❤❤❤'
    }
    ctx.fillText(text, 3 / 4 * canvasWidth - 10, 28)
}

function drawPickupMessage(obj) {
    if (!obj.messageState) return
    ctx.fillStyle = 'white'
    ctx.font = '20px pixelFont'
    ctx.textAlign = 'start'
    ctx.fillText(obj.collectMessage, obj.x, obj.y + 20)
}

function drawManualScreen() {
    blackBackground()
    ctx.textAlign = "center"
    ctx.font = "20px pixelFont"
    ctx.fillStyle = "white"
    ctx.fillText("Collect 🗝 x 5", canvasWidth / 2, 50)
    ctx.fillText("Controls", canvasWidth / 2, 120)
    ctx.fillText("W = UP", canvasWidth / 2, 170)
    ctx.fillText("A = Left", canvasWidth / 2, 200)
    ctx.fillText("D = Right", canvasWidth / 2, 230)
    ctx.fillText("S = DOWN", canvasWidth / 2, 260)
    ctx.fillText("or", canvasWidth / 2, 310)
    ctx.fillText("use gamepad", canvasWidth / 2, 360)
}

function drawPlayer() {
    player1.height = canvasHeight / 10
    player1.width = canvasWidth / 10
    ctx.drawImage(player1.characterSprite, player1.x, player1.y)
}

function drawKey() {
    if (!items.key.collected && items.key.showKey) {
        disableImageSmoothing()
        ctx.drawImage(sprites.items.key, items.key.x, items.key.y, 40, 24)
    }
}

function drawTreasure() {
    if (!items.treasure.collected) {
        disableImageSmoothing()
        ctx.drawImage(sprites.items.treasure, items.treasure.x, items.treasure.y, items.treasure.width, items.treasure.height)
    }
}

function drawBat(bat) {
    ctx.drawImage(gameState.batSprite, bat.x, bat.y, bat.width, bat.height)
}

function blackBackground() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
}

function showShadow() {
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 5
    ctx.shadowOffsetX = 5
    ctx.shadowOffsetY = -5
}

function removeShadow() {
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
}

function drawScoreBoard() {
    ctx.fillStyle = 'white'
    ctx.font = '20px pixelFont'
    ctx.textAlign = 'start'
    ctx.fillText('Score: ' + player1.score, 0, 24)
    ctx.fillText('🗝x' + player1.keys, 190, 24)
    drawLives()
}

function disableImageSmoothing() {
    ctx.webkitImageSmoothingEnabled = false
    ctx.mozImageSmoothingEnabled = false
    ctx.imageSmoothingEnabled = false
}

function drawWall() {
    disableImageSmoothing()
    ctx.drawImage(sprites.items.wall, enemies.obstacle.x, 0, enemies.obstacle.width, enemies.obstacle.height)
    ctx.drawImage(sprites.items.wall, enemies.obstacle.x, enemies.obstacle.y2, enemies.obstacle.width, canvasHeight)
}

function drawAll() {
    if (gameState.state === states.notStarted) {
        drawIntroMessage()
    }
    if (gameState.state === states.wallLevel) {
        drawWallLevel()
    }

    if (gameState.state === states.batLevel) {
        drawBatLevel()
    }

    if (gameState.state === states.lavaLevel) {
        drawLavaLevel()
    }

    if (gameState.state === states.nextRoundMessage) {
        drawNextRoundScreen()
    }

    if (gameState.state === states.gameOverMessage) {
        drawGameOverScreen()
    }

    if (gameState.state === states.victoryMessage) {
        drawVictoryScreen()
    }

    requestAnimationFrame(drawAll)
}

function drawWallLevel() {
    showShadow()
    disableImageSmoothing()
    ctx.drawImage(sprites.backgrounds.ruin, 0, 0, canvasWidth, canvasHeight)
    drawTreasure()
    drawKey()
    drawPlayer()
    drawWall()
    drawBat(enemies.bats[0])
    removeShadow()
    drawPickupMessage(items.key)
    drawPickupMessage(items.treasure)
    drawScoreBoard()
}

function drawBatLevel() {
    showShadow()
    disableImageSmoothing()
    ctx.drawImage(sprites.backgrounds.ruin, 0, 0, canvasWidth, canvasHeight)
    drawPlayer()
    drawTreasure()
    drawKey()
    enemies.bats.forEach(bat => drawBat(bat))
    enemies.randomBats.forEach(bat => drawBat(bat))
    removeShadow()
    drawPickupMessage(items.treasure)
    drawPickupMessage(items.key)
    drawScoreBoard()
}

function drawLavaLevel() {
    showShadow()
    disableImageSmoothing()
    ctx.drawImage(gameState.backgroundLavaLevel, 0, 0, canvasWidth, canvasHeight)
    drawBridges()
    drawPlayer()
    removeShadow()
    drawScoreBoard()
}

/*
###########################
INITIALIZE GAME
###########################
 */

window.onload = function () {
    drawManualScreen()
    addEventListeners()
    intervals.player = setInterval(animateCharacter, 200)
    intervals.bat = setInterval(animateBat, 160)
    intervals.key = setInterval(keyStatusToggle, 5000)
}

function addEventListeners() {
    document.addEventListener('keydown', keyDownHandler, false)
    document.addEventListener('keyup', keyUpHandler, false)
    overlay.addEventListener('touchstart', changeTouchPosition, false)
    overlay.addEventListener('touchmove', changeTouchPosition, false)
    overlay.addEventListener('touchend', function(){touchControls.active = false})
    touchBTNStart.addEventListener('click', () => {
        if (touchBTNStart.disabled) return

        touchBTNStart.disabled = true
        touchBTNStart.style.display = 'none'
        initialize()
        requestAnimationFrame(drawAll)
        setTimeout(startGame, 1500)
        playSound(sounds.start)
    })
}

window.addEventListener('gamepad1Connected', function(e) {

    console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length)
})

const touchBTNStart = document.getElementById("touch-BTN-start")

function startGame() {
    sounds.drums.loop = true
    playSound(sounds.drums)
    gameState.state = states.wallLevel
    player1.score = 0
    touchBTNStart.disabled = true
    initialize()
    intervals.game = setInterval(runWallLevel, 1000 / gameState.gameSpeed)
    randomInterval = setInterval(randomGenerator, 500)
}

function setVolume(value) {
    gameState.volume = value === 0 ? 0 : value * 2 / 10
    const volumeElements = Array.from(document.getElementsByClassName('volume-item'))
    volumeElements.forEach(element => {
        element.innerHTML = element.dataset.value > value ? '&#9645;' : '&#11036;'
    })
    const audio = document.querySelectorAll('audio')
    audio.forEach(sound => sound.volume = gameState.volume)
}

function playSound(sound) {
    if (!sound.playOnce) {
        sound.src.pause()
        sound.src.currentTime = 0
    }

    sound.src.play()
}

function pauseSound(sound) {
    sound.src.pause()
    sound.src.currentTime = 0
}

function keyDownHandler(event) {
    switch (event.key) {
        case 'a':
        case 'ArrowLeft':
            buttonsPressed.a = true
            break
        case 'd':
        case 'ArrowRight':
            buttonsPressed.d = true
            break
        case 'w':
        case 'ArrowUp':
            buttonsPressed.w = true
            break
        case 's':
        case 'ArrowDown':
            buttonsPressed.s = true
            break
    }
}

function keyUpHandler(event) {
    switch (event.key) {
        case 'a':
        case 'ArrowLeft':
            buttonsPressed.a = false
            break
        case 'd':
        case 'ArrowRight':
            buttonsPressed.d = false
            break
        case 'w':
        case 'ArrowUp':
            buttonsPressed.w = false
            break
        case 's':
        case 'ArrowDown':
            buttonsPressed.s = false
            break
    }
}

function initialize() {
    player1.keys = 0
    gameState.keysRequired = 5
    touchBTNStart.disabled = true
    player1.x = 0
    player1.y = canvasHeight / 2
    touchControls.x = 0
    touchControls.y = canvasHeight / 2
    touchControls.active = false
    enemies.obstacle.x = canvasWidth + 200
    enemies.obstacle.y = 0
    enemies.obstacle.height = 25 * Math.floor(Math.random() * 10) + 25
    player1.isCollision = { x: false, y: false }
    items.treasure.x = 10 + Math.floor(Math.random() * 200)
    items.treasure.y = 50
    items.treasure.collected = false
    player1.passedGate = false
    gameState.gameSpeed = 120
    player1.gatesPassed = 0
    player1.lives = 3
    gameState.gameover = false
    gameWon = false

    enemies.bats[0] = {
        x: 700,
        y: 100,
        width: 50,
        height: 30,
        distanceX: 0,
        distanceY: 0,
        speedX: 0.5,
        speedY: 0.5
    }

    enemies.bats[1] = {
        x: 700,
        y: 400,
        width: 50,
        height: 30,
        distanceX: -30,
        distanceY: 10,
        speedX: 0.5,
        speedY: 0.8
    }

    enemies.bats[2] = {
        x: 500,
        y: 100,
        width: 50,
        height: 30,
        distanceX: 30,
        distanceY: 10,
        speedX: 0.8,
        speedY: 0.5
    }

    enemies.randomBats[0] = {
        x: 200,
        y: 200,
        width: 50,
        height: 30,
        multiplierX: 1,
        multiplierY: 1
    }

    enemies.randomBats[1] = {
        x: 300,
        y: 50,
        width: 50,
        height: 30,
        multiplierX: -1,
        multiplierY: 1
    }
}

const touchControls = {
    x: null,
    y: null,
    active: false,
}