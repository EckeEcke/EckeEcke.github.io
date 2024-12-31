window.addEventListener("gamepad1Connected", function(e) {

console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length)
})

const canvas = document.getElementById("game-canvas")
const ctx = canvas.getContext("2d")
let aPressed, sPressed, wPressed, dPressed = false

let player1 = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    characterSprite: "",
    invincibility: false
}

const characterSprite1 = document.getElementById("character1")
const characterSprite2 = document.getElementById("character2")

const lavaBackground1 = document.getElementById("lava-background1")
const lavaBackground2 = document.getElementById("lava-background2")

const batSprite1 = document.getElementById("bat1")
const batSprite2 = document.getElementById("bat2")

const overlay = document.getElementById("damage-overlay")
let backgroundLevel3 = lavaBackground1

const bridgeImage = document.getElementById("bridge")

let isCollision = { x: false, y: false }
let kickback
let kickbackY

let treasure = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    collectMessage: "LOOT!",
    messagteState: false,
    collectState: false
}

let obstacle = {
    x: canvas.width + 200,
    y: 0,
    y2: 0,
    width: 30,
    height: 0
}

let passedGate
let score
let blockMovementLeft = false
let gameSpeed
let gatesPassed
let lives
let character
let characterSprite
let characterAnimation
let gameInterval
let gameover = false

let bat1 = {
    x: 700,
    y: 100,
    width: 50,
    height: 30,
    distanceX: 0,
    distanceY: 0,
    speedX: 0.5,
    speedY: 0.5
}

let bat2 = {
    x: 700,
    y: 400,
    width: 50,
    height: 30,
    distanceX: -30,
    distanceY: 10,
    speedX: 0.5,
    speedY: 0.8
}

let bat3 = {
    x: 500,
    y: 100,
    width: 50,
    height: 30,
    distanceX: 30,
    distanceY: 10,
    speedX: 0.8,
    speedY: 0.5
}

let randomBat = {
    x: 200,
    y: 200,
    width: 50,
    height: 30,
    multiplierX: 1,
    multiplierY: 1
}

let randomBat2 = {
    x: 300,
    y: 50,
    width: 50,
    height: 30,
    multiplierX: -1,
    multiplierY: 1
}

let batSprite
let batState = false
let randomNumber
let round = 1
let treasureCooldown = false
let keyAppears
let backgroundLavaOne = false

let key = {
    x: 0,
    y: 0,
    collectMessage: "KEY!",
    messageState: false,
    collectState: false
}

let keys = 0
let keysRequired = 5

let bridge1 = {
    x: 84,
    y: 100,
    width: 100,
    height: 50
}

let bridge2 = {
    x: 192,
    y: 700,
    width: 100,
    height: 50
}

let touchX
let touchY
let touchControls = false

let volume = 1

const deathsound = { src: document.getElementById("death"), playOnce: true }
const startsound = { src: document.getElementById("start-sound"), playOnce: true }
const gameoversound = { src: document.getElementById("gameover-sound"), playOnce: true }
const treasuresound = { src: document.getElementById("treasure-sound"), playOnce: false }
const keysound = { src: document.getElementById("key-sound"), playOnce: false }
const gatesound = { src: document.getElementById("gate-sound"), playOnce: false }
const hurtsound = { src: document.getElementById("hurt-sound"), playOnce: true }
const victorysound = { src: document.getElementById("victory-sound"), playOnce: true }
const batSound = { src: document.getElementById("bat-sound"), playOnce: true }


const touchBTNStart = document.getElementById("touch-BTN-start")


window.onload = function () {
    canvas.width = 400
    canvas.height = 400
    drawManualScreen()
    addEventListeners()
    characterAnimation = setInterval(animateCharacter, 200)
    batAnimation = setInterval(animateBat, 160)
    makeKeyAppear = setInterval(keyStatusToggle, 5000)
}

function drawManualScreen() {
    blackBackground()
    ctx.textAlign = "center"
    ctx.font = "20px pixelFont"
    ctx.fillStyle = "white"
    ctx.fillText("Collect 🗝 x 5", canvas.width / 2, 50)
    ctx.fillText("Controls", canvas.width / 2, 120)
    ctx.fillText("W = UP", canvas.width / 2, 170)
    ctx.fillText("A = Left", canvas.width / 2, 200)
    ctx.fillText("D = Right", canvas.width / 2, 230)
    ctx.fillText("S = DOWN", canvas.width / 2, 260)
    ctx.fillText("or", canvas.width / 2, 310)
    ctx.fillText("use gamepad", canvas.width / 2, 360)
}

function addEventListeners() {
    document.addEventListener("keydown", keyDownHandler, false)
    document.addEventListener("keyup", keyUpHandler, false)
    overlay.addEventListener("touchstart", changeTouchPosition, false)
    overlay.addEventListener("touchmove", changeTouchPosition, false)
    overlay.addEventListener("touchend", function(){touchControls= false})
    touchBTNStart.addEventListener("click", () => {
        if (touchBTNStart.disabled) return

        touchBTNStart.disabled = true
        touchBTNStart.style.display = "none"
        initialize()
        blackBackground()
        ctx.fillStyle = "white"
        ctx.fillText("Get ready", canvas.width / 2, canvas.height / 2)
        setTimeout(startGame, 1500)
        playSound(startsound)
    })
}

function setVolume(value) {
    volume = value === 0 ? 0 : value * 2 / 10
    const volumeElements = Array.from(document.getElementsByClassName('volume-item'))
    volumeElements.forEach(element => {
            element.innerHTML = element.dataset.value > value ? '&#9645;' : '&#11036;'
    })
    const audio = document.querySelectorAll('audio')
    audio.forEach(sound => sound.volume = volume)
}

function playSound(sound, volume) {
    if (!sound.playOnce) {
        sound.src.pause()
        sound.src.currentTime = 0
    }

    sound.src.play()
}

function keyDownHandler(event) {
    switch (event.keyCode) {
        case 65:
            aPressed = true
            break
        case 68:
            dPressed = true
            break
        case 87:
            wPressed = true
            break
        case 83:
            sPressed = true
            break
    }
}

function keyUpHandler(event) {
    switch (event.keyCode) {
        case 65:
            aPressed = false
            break
        case 68:
            dPressed = false
            break
        case 87:
            wPressed = false
            break
        case 83:
            sPressed = false
            break
    }
}

function initialize() {

    keys = 0
    keysRequired = 5
    touchBTNStart.disabled = true
    player1.x = 0
    player1.y = canvas.height / 2
    touchX = 0
    touchY = canvas.height / 2
    touchControls = false
    obstacle.x = canvas.width + 200
    obstacle.y = 0
    obstacle.height = 25 * Math.floor(Math.random() * 10)
    isCollision = { x: false, y: false }
    treasure.x = 10 + Math.floor(Math.random() * 200)
    treasure.y = 50
    treasure.collectState = false
    passedGate = false
    gameSpeed = 120
    gatesPassed = 0
    lives = 3
    character = true
    player1.characterSprite = characterSprite2
    gameover = false
    gameWon = false

    bat1 = {
        x: 700,
        y: 100,
        width: 50,
        height: 30,
        distanceX: 0,
        distanceY: 0,
        speedX: 0.5,
        speedY: 0.5
    }

    bat2 = {
        x: 700,
        y: 400,
        width: 50,
        height: 30,
        distanceX: -30,
        distanceY: 10,
        speedX: 0.5,
        speedY: 0.8
    }

    bat3 = {
        x: 500,
        y: 100,
        width: 50,
        height: 30,
        distanceX: 30,
        distanceY: 10,
        speedX: 0.8,
        speedY: 0.5
    }

    randomBat = {
        x: 200,
        y: 200,
        width: 50,
        height: 30,
        multiplierX: 1,
        multiplierY: 1
    }

    randomBat2 = {
        x: 300,
        y: 50,
        width: 50,
        height: 30,
        multiplierX: -1,
        multiplierY: 1
    }
}

function resetPlayerposition() {
    player1.x = 0
    player1.y = canvas.height / 2
}

function startGame() {
    score = 0
    touchBTNStart.disabled = true
    initialize()
    gameInterval = setInterval(callAllRound1, 1000 / gameSpeed)
    randomInterval = setInterval(randomGenerator, 500)
}

function drawPlayer() {
    player1.height = canvas.height / 10
    player1.width = canvas.width / 10
    ctx.drawImage(player1.characterSprite, player1.x, player1.y)
}

function movePlayerTouch(event) {
    if (touchControls) {
        if (touchX - 80 < player1.x) {
            player1.x -= 2
            if (player1.x < 0) {
                player1.x = 0
            }
        }

        if (touchX -80 > player1.x) {
            player1.x += 2
            if (player1.x > canvas.width) {
                player1.x = canvas.width - 10
            }
        }

        if (touchY -150 < player1.y) {
            player1.y -= 2
            if (player1.y < 0) {
                player1.y = 0
            }
        }

        if (touchY -150 > player1.y) {
            player1.y += 2
            if (player1.y > canvas.height - 20) {
                player1.y = canvas.height - 20
            }
        }
    }
}

function changeTouchPosition(event) {
    touchControls = true
    touchX = event.targetTouches ? event.targetTouches[0].pageX - overlay.offsetLeft : event.offsetX
    touchY = event.targetTouches ? event.targetTouches[0].pageY - overlay.offsetTop : event.offsetY
}

function movePlayerGamepad() {
    if (navigator.getGamepads()[0].buttons[14].pressed && player1.x > 0) {
        if (player1.x > obstacle.x + obstacle.width && player1.x < obstacle.x + obstacle.width) {
            player1.x == obstacle.x + obstacle.width
        } else {
            player1.x -= 2
        }
    }

    if (navigator.getGamepads()[0].buttons[15].pressed && player1.x < 9 * canvas.width / 10 && !isCollision.x) {
        player1.x += 2
    }

    if (navigator.getGamepads()[0].buttons[12].pressed && player1.y > 0) {
        player1.y -= 2
    }

    if (navigator.getGamepads()[0].buttons[13].pressed && player1.y < 9 * canvas.height / 10) {
        player1.y += 2
    }
}

function movePlayer() {
    const gamepad1Connected = navigator.getGamepads()[0] !== null

    if (gamepad1Connected) {
        movePlayerGamepad()
    }

    if (aPressed && player1.x > 0) {
        player1.x > obstacle.x + obstacle.width && player1.x < obstacle.x + obstacle.width 
            ? player1.x == obstacle.x + obstacle.width
            : player1.x -= 2
    }
    
    if (dPressed && player1.x < 9 * canvas.width / 10 && !isCollision.x) {
        player1.x += 2
    }

    if (wPressed && player1.y > 0) {
        player1.y -= 2
    }

    if (sPressed && player1.y < 9 * canvas.height / 10) {
        player1.y += 2
    }

    if (isCollision.x) {
        player1.x += kickback
        kickback -= 1
        if (kickback === -12 || kickback === 12) {
            isCollision.x = false
            kickback = 0
        }
    }

    if (isCollision.y) {
        player1.y += kickbackY
        kickbackY += 1
        if (kickbackY === 6 || kickbackY === -6) {
            isCollision.y = false
            kickbackY = 0
        }
    }
}

function collision() {
    if (obstacle.x < player1.x + player1.width && obstacle.x >= player1.x + player1.width - 4) {
        if ((player1.y < obstacle.y + obstacle.height - 10) || (obstacle.y2 < player1.y + player1.height)) {
            playSound(hurtsound)
            isCollision.x = true
            kickback = -4
        }

    }
    
    if (player1.x < obstacle.x + obstacle.width && player1.x + player1.width > obstacle.x) {
        if ((player1.y <= obstacle.y + obstacle.height && player1.y >= obstacle.y + obstacle.height - 2) || (player1.y < obstacle.y2 + 2 && player1.y + player1.height > obstacle.y2)) {
                isCollision.y = true
                kickbackY = 4
        }
    }

    if (passedGate) {
        if (player1.x < obstacle.x + obstacle.width) {
            player1.x = obstacle.x + obstacle.width
        }
    }
}

function handleInvincibility() {
    if (!player1.invincibility) {
        lives -= 1
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

function handlePlayer() {
    drawPlayer()
    movePlayerTouch()
    movePlayer()
    collision()
}


function animateCharacter() {
    character = !character
    player1.characterSprite = (character == true) ? characterSprite2 : player1.characterSprite = characterSprite1
}

function keyStatusToggle() {
    keyAppears = !keyAppears
    key.collectState = false
    key.x = 20 + Math.floor(Math.random() * 300)
    key.y = 50 + Math.floor(Math.random() * 300)
}

function drawKey() {
    if (!key.collectState && keyAppears) {
        ctx.webkitImageSmoothingEnabled = false
        ctx.mozImageSmoothingEnabled = false
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(document.getElementById("key"), key.x, key.y, 40, 24)
    }
}

function collectKey() {
    if (player1.x < key.x + 40 && player1.x + player1.width > key.x && player1.y < key.y + 25 && player1.y + player1.height > key.y && !key.collectState) {
        playSound(keysound)
        keys += 1
        key.collectState = true
        key.messageState = true
    }
}

function handleKey() {
    drawKey()
    collectKey()
}

function drawTreasure() {
    if (!treasure.collectState) {
        ctx.webkitImageSmoothingEnabled = false
        ctx.mozImageSmoothingEnabled = false
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(document.getElementById("treasure"), treasure.x, treasure.y, treasure.width, treasure.height)
    }
}

function collectTreasure() {
    if (player1.x < treasure.x + treasure.width && player1.x + player1.width > treasure.x && player1.y < treasure.y + treasure.height && player1.y + player1.height > treasure.y && !treasure.collectState) {
        playSound(treasuresound)
        treasure.collectState = true
        score += 20
        treasure.messageState = true
        if (round == 2 && treasure.collectState && !treasureCooldown) {
            treasureCooldown = true
            setTimeout(function () {
                treasure.x = 20 + Math.floor(Math.random() * 200)
                treasure.y = 20 + Math.floor(Math.random() * 350)
                treasure.collectState = false
                treasureCooldown = false
            }, 500)
        }
    }
}

function handleTreasure() {
    drawTreasure()
    collectTreasure()
}

function drawBat(bat) {
    ctx.drawImage(batSprite, bat.x, bat.y, bat.width, bat.height)
}

function moveBat(bat) {
    let divisor = 1
    if(randomNumber > 0.6){
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

function batCollision(bat) {
    if (player1.x + 15 < bat.x + 35 && player1.x + player1.width > bat.x + 15 && player1.y + 10 <= bat.y + 20 && player1.y + player1.height >= bat.y && !player1.invincibility) {
        playSound(hurtsound)
        playSound(batSound)
        handleInvincibility()
    }
}

function handleBat(bat) {
    drawBat(bat)
    moveBat(bat)
    batCollision(bat)
}

function randomGenerator() {
    randomNumber = Math.random()
}

function moveByRandom(bat) {
    batCollision(bat)

    if (randomNumber < 0.4) {
        bat.x += 1 * bat.multiplierX
        bat.y += 1 * bat.multiplierY
    } else if (randomNumber >= 0.4 && randomNumber < 0.6) {
        bat.x += 0.8 * bat.multiplierX
        bat.y -= 1 * bat.multiplierY
    } else if (randomNumber >= 0.6 && randomNumber < 0.8) {
        bat.x -= 1 * bat.multiplierX
        bat.y -= 0.8 * bat.multiplierY
    } else {
        bat.x -= 1 * bat.multiplierX
        bat.Y += 1 * bat.multiplierY
    }

    if (bat.x > canvas.width - 30) {
        bat.x = canvas.width - 30
    }

    if (bat.x < 20) {
        bat.x = 20
    }

    if (bat.y > canvas.height - 30) {
        bat.y = canvas.height - 30
    }

    if (bat.y < 20) {
        bat.y = 20
    }
}

function handleRandomBat(bat) {
    drawBat(bat)
    moveByRandom(bat)
    batCollision(bat)
}


function pickupMessage(obj) {
    if (obj.messageState) {

        ctx.fillText(obj.collectMessage, obj.x, obj.y + 20)
        setTimeout(() => obj.messageState = false, 500)
    }
}


function callAllRound1() {
    showShadow()
    disableImageSmoothing()
    ctx.drawImage(document.getElementById("background"), 0, 0, canvas.width, canvas.height)
    raiseSpeed()
    ctx.fillStyle = "white"
    ctx.font = "20px pixelFont"
    ctx.textAlign = "start"
    handleTreasure()
    handleKey()
    drawObstacle()
    handlePlayer()
    handleBat(bat1)
    removeShadow()
    pickupMessage(key)
    pickupMessage(treasure)
    scoreBoard()
    endGame()
    nextRound()
}

function callAllRound2() {
    showShadow()
    disableImageSmoothing()
    ctx.drawImage(document.getElementById("background"), 0, 0, canvas.width, canvas.height)
    raiseSpeed()
    ctx.fillStyle = "white"
    ctx.font = "20px pixelFont"
    ctx.textAlign = "start"
    handleTreasure()
    handlePlayer()
    handleKey()
    handleBat(bat1)
    handleBat(bat2)
    handleBat(bat3)
    handleRandomBat(randomBat)
    handleRandomBat(randomBat2)
    removeShadow()
    pickupMessage(treasure)
    pickupMessage(key)
    scoreBoard()
    endGame()
    nextRound()
}

function callAllRound3() {
    showShadow()
    disableImageSmoothing()
    ctx.drawImage(backgroundLevel3, 0, 0, canvas.width, canvas.height)
    raiseSpeed()
    ctx.fillStyle = "white"
    ctx.font = "20px pixelFont"
    ctx.textAlign = "start"
    drawBridges()
    drawPlayer()
    movePlayer()
    movePlayerTouch()
    removeShadow()
    scoreBoard()
    endGame()
    nextRound()
    bridgeCollision(bridge1,1,100)
    bridgeCollision(bridge2,-1.2,-100)
    lavaCollision()
    winGame()
    carriedByBridge = false
}

function blackBackground() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function showShadow() {
    ctx.shadowColor = "black"
    ctx.shadowBlur = 5
    ctx.shadowOffsetX = 5
    ctx.shadowOffsetY = -5
}

function removeShadow() {
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
}

function scoreBoard() {
    ctx.fillText("Score: " + score, 0, 24)
    ctx.fillText("🗝x" + keys, 190, 24)
    drawLives()
}

function disableImageSmoothing() {
    ctx.webkitImageSmoothingEnabled = false
    ctx.mozImageSmoothingEnabled = false
    ctx.imageSmoothingEnabled = false
}

function animateBat() {
    batState = !batState
    batSprite = (batState == true) ? batSprite1 : batSprite2
}

function toggleBackground() {
    backgroundLavaOne = !backgroundLavaOne
    backgroundLevel3 = (backgroundLavaOne == true) ? lavaBackground1 : lavaBackground2
}

function drawObstacle() {
    obstacle.y2 = obstacle.height + 60
    ctx.webkitImageSmoothingEnabled = false
    ctx.mozImageSmoothingEnabled = false
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(document.getElementById("wall"), obstacle.x, 0, obstacle.width, obstacle.height)
    ctx.drawImage(document.getElementById("wall"), obstacle.x, obstacle.y2, obstacle.width, canvas.height)
    obstacle.x -= 1

    if (obstacle.x < -30) {
        obstacle.x = canvas.width + 50
        obstacle.height = 25 * Math.floor(Math.random() * 10)
        passedGate = false
        treasure.x = 20 + Math.floor(Math.random() * 200)
        treasure.y = 20 + Math.floor(Math.random() * 350)
        treasure.collectState = false
    }
}

function drawLives() {
    ctx.fillStyle = "red"
    ctx.font = "30px pixelFont"

    switch (lives) {
        case 0:
            text = "♡♡♡"
            break
        case 1:
            text = "❤♡♡"
            break
        case 2:
            text = "❤❤♡"
            break
        default:
            text = "❤❤❤"
    }
    ctx.fillText(text, 3 / 4 * canvas.width - 10, 28)
}


function endGame() {
    if (player1.x + player1.width < -30 || lives === 0) {
        lives = 0
        gameSpeed = 10
        playSound(deathsound)
        clearInterval(gameInterval)

        switch (round) {
            case 1: {
                gameInterval = setInterval(callAllRound1, 1000 / gameSpeed)
                break
            }
            case 2: {
                gameInterval = setInterval(callAllRound2, 1000 / gameSpeed)
                break
            }
            case 3: {
                gameInterval = setInterval(callAllRound3, 1000 / gameSpeed)
                break
            }
        }

        if (!gameover) {
            gameover = true
            setTimeout(function () {
                round = 1
                touchBTNStart.disabled = false
                touchBTNStart.style.display = "block"
                clearInterval(gameInterval)
                playSound(gameoversound)
                blackBackground()
                ctx.fillStyle = "white"
                ctx.font = "30px pixelFont"
                ctx.textAlign = "center"
                ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 50)
                ctx.font = "20px pixelFont"
                ctx.fillText("Your score: " + score, canvas.width / 2, canvas.height / 2 + 50)
                ctx.fillText("Hit Start for retry", canvas.width / 2, canvas.height / 2 + 100)
            }, 1000)
        }
    }
}

function nextRound() {
    if (keys === keysRequired) {
        touchControls = false
        round += 1
        clearInterval(gameInterval)
        initialize()
        playSound(startsound)
        setTimeout(() => {
            blackBackground()
            ctx.fillStyle = "white"
            ctx.font = "30px pixelFont"
            ctx.textAlign = "center"
            ctx.fillText("Next round!", canvas.width / 2, canvas.height / 2 - 50)
        }, 1000)
        if (round === 2) {
            setTimeout(() => gameInterval = setInterval(callAllRound2, 1000 / gameSpeed), 2000)
        }
        if (round === 3) {
            setTimeout(() => gameInterval = setInterval(callAllRound3, 1000 / gameSpeed), 2000)
            backgroundAnimation = setInterval(toggleBackground, 1000)
        }
    }
}

function raiseSpeed() {
    if (player1.x > obstacle.x + 10 && !passedGate) {
        gatesPassed += 1
        playSound(gatesound)
        passedGate = true
    }
    if (gatesPassed == 4) {
        gatesPassed = 0
        gameSpeed = 1.1 * gameSpeed
        clearInterval(gameInterval)
        gameInterval = setInterval(callAllRound1, 1000 / gameSpeed)
    }
}

function drawBridges() {
    ctx.drawImage(bridgeImage, bridge1.x, bridge1.y, bridge1.width, bridge1.height)
    ctx.drawImage(bridgeImage, bridge1.x, bridge1.y + 100, bridge1.width, bridge1.height)
    ctx.drawImage(bridgeImage, bridge2.x, bridge2.y, bridge2.width, bridge2.height)
    ctx.drawImage(bridgeImage, bridge2.x, bridge2.y - 100, bridge2.width, bridge2.height)
    bridge1.y < canvas.height + 200 ? bridge1.y += 1 : bridge1.y = -200
    bridge2.y > -200 ? bridge2.y -= 1.2 : bridge2.y = 700
}

function lavaCollision() {
    if (player1.x > 60 && !carriedByBridge && player1.x < 260) {
        lives -= 1
        overlay.style.opacity = 0.3
        setTimeout(function() {
            overlay.style.opacity = 0
            }, 200)

        if (lives >= 1 && !blockMovementLeft){
            blockMovementLeft = true
            setTimeout(()=>{blockMovementLeft = false}, 500)
        }
        playSound(hurtsound)
    }

    if (blockMovementLeft){
        resetPlayerposition()
    }
}

let carriedByBridge = false;

function bridgeCollision(bridge, moveY, secondBridgeY) {
    if (bridge.x < player1.x + player1.width && bridge.x + bridge.width > player1.x) {
        if (
            (player1.y + player1.height - 10 < bridge.y + bridge.height - 10 && bridge.y < player1.y + player1.height) || 
            (player1.y + player1.height - 10 < bridge.y + secondBridgeY + bridge.height - 10 && bridge.y + secondBridgeY < player1.y + player1.height)
        ) {
            carriedByBridge = true
        }
    }
    
    if (bridge.x < player1.x + player1.width / 2 && bridge.x + bridge.width > player1.x + player1.width / 2) {
        player1.y += moveY
    } 
}

let jumpUp = true
let characterJump = 0

function winAnimation() {
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
        playSound(victorysound)
        gameWon = true
        score += 500
        clearInterval(gameInterval)
        gameInterval = setInterval(() => {
            ctx.shadowColor = "black"
            ctx.shadowBlur = 5
            ctx.shadowOffsetX = 5
            ctx.shadowOffsetY = -5

            ctx.webkitImageSmoothingEnabled = false
            ctx.mozImageSmoothingEnabled = false
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(backgroundLevel3, 0, 0, canvas.width, canvas.height)

            raiseSpeed()
            ctx.fillStyle = "white"
            ctx.font = "20px pixelFont"
            ctx.textAlign = "start"
            drawBridges()
            drawPlayer()
            winAnimation()

            ctx.shadowBlur = 0
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
            ctx.fillText("Score: " + score, 0, 24)
            ctx.fillText("🗝x" + keys, 190, 24)

            drawLives()
        }, 1000 / 60)
        setTimeout(() => {
            clearInterval(gameInterval)
            blackBackground()
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.font = "30px pixelFont"
            ctx.fillText("You win!", canvas.width / 2, canvas.height / 2)
            ctx.font = "24px pixelFont"
            ctx.fillText("Your score: " + score, canvas.width / 2, canvas.height / 2 + 60)
        }, 2000)
    }
}

const burgerMenu = document.getElementById("burger-menu")
let burgerMenuShowing = false

function showMenu() {
    burgerMenuShowing = !burgerMenuShowing
    if (burgerMenuShowing) {
        burgerMenu.style.height = "100vh"
        burgerMenu.style.opacity = "0.99"
        burgerMenu.style.zIndex = "2500"
        hamburger.style.position = "fixed"
    }
    else {
        burgerMenu.style.height = "0vh"
        burgerMenu.style.opacity = "0"
        burgerMenu.style.zIndex = "-3000"
        hamburger.style.position = "absolute"
    }
}
