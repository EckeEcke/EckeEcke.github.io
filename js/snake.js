document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('resize', setCanvasSize, false)
const canvas = document.getElementById("game")
const ctx = canvas.getContext('2d')
const scoreBoard = document.getElementById("score")
const messageBox = document.getElementById("message")
let rightPressed = false
let leftPressed = false
let upPressed = false
let downPressed = false
let direction = "up"
let allowDirectionChange = true
let itemCollected = false
let gameSpeed = 200
let gameInterval
let score = 0
let level = 1

let iso = new Isomer(document.getElementById("game"))
let Shape = Isomer.Shape
let Point = Isomer.Point
let Color = Isomer.Color
let colorPalette = {
    playfieldColor: new Color(51, 51, 51),
    snakeColor: new Color(153, 153, 153),
    itemColor: new Color(255, 204, 0),
    poopColor: new Color(255, 59, 48),
}

const palette1 = {
    playfieldColor: new Color(50, 98, 115),
    snakeColor: new Color(238, 238, 238),
    itemColor: new Color(227, 151, 116),
    poopColor: new Color(255, 69, 58),
}

const palette2 = {
    playfieldColor: new Color(58, 87, 67),
    snakeColor: new Color(252, 236, 82),
    itemColor: new Color(59, 112, 128),
    poopColor: new Color(255, 59, 48),
}

const palette3 = {
    playfieldColor: new Color(25, 11, 40),
    snakeColor: new Color(104, 87, 98),
    itemColor: new Color(229, 83, 129),
    poopColor: new Color(255, 0, 0),
}

const palette4 = {
    playfieldColor: new Color(57, 57, 58),
    snakeColor: new Color(133, 255, 199),
    itemColor: new Color(255, 133, 82),
    poopColor: new Color(255, 0, 0),
}

const palette5 = {
    playfieldColor: new Color(41, 23, 17),
    snakeColor: new Color(141, 220, 164),
    itemColor: new Color(99, 50, 110),
    poopColor: new Color(255, 59, 48),
}

const palette6 = {
    playfieldColor: new Color(99, 50, 110),
    snakeColor: new Color(242, 243, 174),
    itemColor: new Color(255, 82, 27),
    poopColor: new Color(255, 0, 0),
}

const palette7 = {
    playfieldColor: new Color(51, 51, 51),
    snakeColor: new Color(153, 153, 153),
    itemColor: new Color(255, 204, 0),
    poopColor: new Color(255, 59, 48),
}


let snake = [
    {
        x: 0,
        y: 1.5,
        demoMoves: ["right","up","right","right","down","down","down","left","left","left","up","up"]
    },
    {
        x: 0,
        y: 1,
        moves: ["up"],
        demoMoves: ["up","right","up","right","right","down","down","down","left","left","left","up"]
    },
    {
        x: 0,
        y: 0.5,
        moves: ["up","up"],
        demoMoves: ["up","up","right","up","right","right","down","down","down","left","left","left"]
    }
]

let item = {
    x: 5,
    y: 5,
    type: "item"
}

let poop = {
    x: -1,
    y: -1,
    type: "poop"
}

function setCanvasSize(){
    canvas.innerWidth = document.getElementById("canvas-wrapper").clientWidth
    canvas.innerHeight = 0.7 * document.getElementById("canvas-wrapper").clientWidth
}

setCanvasSize()
let demo = setInterval(showDemo,500)
function showDemo(){
    moveSnake(true)
    drawSnake(0.5)
}

function keyDownHandler(event) {
    event.preventDefault()
    if(allowDirectionChange){
        if(event.keyCode == 39) {
            rightPressed = true
            if(direction != "up"){
                direction = "down"
                allowDirectionChange = false
            }
        }
        else if(event.keyCode == 37) {
            leftPressed = true
            if(direction !="down")
            direction = "up"
            allowDirectionChange = false
        }
        if(event.keyCode == 40) {
            downPressed = true
            if(direction != "right"){
                direction = "left"
                allowDirectionChange = false
            }
        }
        else if(event.keyCode == 38) {
            upPressed = true
            if(direction != "left"){
                direction = "right"
                allowDirectionChange = false
            }   
        }
    }
    
}

function keyUpHandler(event) {
    event.preventDefault()
    if(event.keyCode == 39) {
        rightPressed = false
    }
    else if(event.keyCode == 37) {
        leftPressed = false
    }
    if(event.keyCode == 40) {
    downPressed = false
    }
    else if(event.keyCode == 38) {
    upPressed = false
    }
}

function moveSnake(demo){
    snake.forEach((element,index) =>{
        if(index > 0 && !demo){
            if(element.moves[0] == "up"){
                element.y += 0.5
            }
            if(element.moves[0] == "down"){
                element.y -= 0.5
            }
            if(element.moves[0] == "left"){
                element.x -= 0.5
            }
            if(element.moves[0] == "right"){
                element.x += 0.5
            }
            element.moves = element.moves.slice(1)
            element.moves.push(direction)
        }
        if(demo){
            if(element.demoMoves[0] == "up"){
                element.y += 0.5
            }
            if(element.demoMoves[0] == "down"){
                element.y -= 0.5
            }
            if(element.demoMoves[0] == "left"){
                element.x -= 0.5
            }
            if(element.demoMoves[0] == "right"){
                element.x += 0.5
            }
            element.demoMoves.push(element.demoMoves[0])
            element.demoMoves = element.demoMoves.slice(1)
        }
    })
    allowDirectionChange = true
    
}
function moveSnakeHead(){
    const snakeHead = snake[0]
    if(direction == "up"){
        snakeHead.y += 0.5
    }
    if(direction == "down"){
        snakeHead.y -= 0.5
    }
    if(direction == "right"){
        snakeHead.x += 0.5
    }
    if(direction == "left"){
        snakeHead.x -= 0.5
    }
    itemCollision(item)
}

function replaceItem() {
    itemCollected = false

    let newX, newY

    do {
        newX = generateRandomIntegerInRange(0, 7)
        newY = generateRandomIntegerInRange(0, 7)
    } while (newX === item.x && newY === item.y)

    item.x = newX
    item.y = newY
}

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function itemCollision(){
    if(collision(item) && !itemCollected){
        score += 1
        scoreBoard.innerHTML = score
        itemCollected = true
        poop.x = item.x
        poop.y = item.y
        let clonedMoves = [...snake[snake.length - 1].moves]
        clonedMoves.unshift("")
        snake.push({
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y,
            moves: clonedMoves
        })
        setTimeout(
            replaceItem,1000
        )
        if(score == 5){
            gameSpeed -= 50
            level = 2
            changeColorPalette(palette1)
        }
        if(score == 10){
            gameSpeed -= 40
            level = 3
            changeColorPalette(palette2)
        }
        if(score == 15){
            gameSpeed -= 30
            level = 4
            changeColorPalette(palette3)
        }
        if(score == 20){
            gameSpeed -= 20
            level = 5
            changeColorPalette(palette4)
        }
        if(score == 25){
            gameSpeed -= 20
            level = 6
            changeColorPalette(palette5)
        }
        if(score == 30){
            gameSpeed -= 10
            level = 7
            changeColorPalette(palette6)
        }
        if(score%5==0){
            clearInterval(gameInterval)
            gameInterval = setInterval(runGame,gameSpeed)
            document.getElementById("level").innerHTML = level
        }
    }
}

function changeColorPalette(palette){
    colorPalette = palette
}

function collision(element){
    const snakeHead = snake[0]
    return element.x + 0.5 > snakeHead.x && element.x < snakeHead.x + 0.5 && element.y + 0.5 > snakeHead.y && element.y < snakeHead.y + 0.5
}

function drawSnake(height){
    let snakeClone = [...snake]
    snakeClone.push(item)
    snakeClone.push(poop)
    snakeClone.sort(function(a,b){
        return b.x - a.x
    })
    snakeClone.sort(function(a,b){
        return b.y - a.y
    })
    ctx.clearRect(0,0,canvas.width,canvas.height)
    iso.add(
        Shape.Prism(new Point(0,0,-1),8,8,1),colorPalette.playfieldColor
    )

    snakeClone.forEach(element => {
        if(!element.type){
            iso.add(
            Shape.Prism(new Point(0 + element.x,element.y,0), 0.5, 0.5, height),colorPalette.snakeColor
        )
        } else {
            if(element.type === "poop" && element.x >= 0){
                iso.add(
                    Shape.Pyramid(new Point(0 + poop.x,poop.y,0), 0.5, 0.5, 0.5),colorPalette.poopColor
                )
            }    
            else if (element.type === "item" && !itemCollected){
            iso.add(
                Shape.Prism(new Point(0 + element.x,element.y,0), 0.5, 0.5, 0.5),colorPalette.itemColor
            )
        }}
            
    }
)}

let runGame = ()=>{
    drawSnake(0.5)
    moveSnakeHead()
    moveSnake(false)
    checkGameOver()
    setCanvasSize()
}

function startGame(){
    clearInterval(demo)
    snake = [
        {
            x: 0,
            y: 1.5,
            demoMoves: ["right","up","right","right","down","down","down","left","left","left","up","up"]
        },
        {
            x: 0,
            y: 1,
            moves: ["up"],
            demoMoves: ["up","right","up","right","right","down","down","down","left","left","left","up"]
        },
        {
            x: 0,
            y: 0.5,
            moves: ["up","up"],
            demoMoves: ["up","up","right","up","right","right","down","down","down","left","left","left"]
        }
    ]
    gameInterval = setInterval(runGame,gameSpeed)
    messageBox.innerHTML = ""
}

function checkGameOver(){
    const snakeHead = snake[0]
    if(snakeHead.y > 7.5 || snakeHead.y < 0 || snakeHead.x > 7.5 || snakeHead.x < 0){
        clearInterval(gameInterval)
        animateGameOver()
    }
    snake.forEach((element,index)=>{
        if (index === 0 && collision(poop) && !itemCollected){
            clearInterval(gameInterval)
            animateGameOver()
        }
        if(index > 0){
            if(collision(element)){
                clearInterval(gameInterval)
                animateGameOver()
            }
        }
    })
}

function animateGameOver(){
    let height = 0.5
    let animation = setInterval(()=>{
        drawSnake(height)
        messageBox.innerHTML = "<button onclick='location.reload()'>RETRY</button>"
        if(height > 0){
            height -= 0.01
        } else clearInterval(animation)
    },1000/60)
}