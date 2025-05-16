const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreBoard = document.getElementById('score')
const messageBox = document.getElementById('message')
let rightPressed = false
let leftPressed = false
let upPressed = false
let downPressed = false
let direction = 'up'
let allowDirectionChange = true
let itemCollected = false
let gameSpeed = 200
let gameInterval
let score = 0
let level = 1

const iso = new Isomer(canvas)
let Shape = Isomer.Shape
let Point = Isomer.Point
let Color = Isomer.Color

const palette1 = {
    playfieldColor: new Color(51, 51, 51),
    snakeColor: new Color(153, 153, 153),
    itemColor: new Color(255, 204, 0),
    poopColor: new Color(255, 59, 48),
}

const palette2 = {
    playfieldColor: new Color(50, 98, 115),
    snakeColor: new Color(238, 238, 238),
    itemColor: new Color(227, 151, 116),
    poopColor: new Color(255, 69, 58),
}

const palette3 = {
    playfieldColor: new Color(58, 87, 67),
    snakeColor: new Color(252, 236, 82),
    itemColor: new Color(59, 112, 128),
    poopColor: new Color(255, 59, 48),
}

const palette4 = {
    playfieldColor: new Color(25, 11, 40),
    snakeColor: new Color(104, 87, 98),
    itemColor: new Color(229, 83, 129),
    poopColor: new Color(255, 0, 0),
}

const palette5 = {
    playfieldColor: new Color(57, 57, 58),
    snakeColor: new Color(133, 255, 199),
    itemColor: new Color(255, 133, 82),
    poopColor: new Color(255, 0, 0),
}

const palette6 = {
    playfieldColor: new Color(41, 23, 17),
    snakeColor: new Color(141, 220, 164),
    itemColor: new Color(99, 50, 110),
    poopColor: new Color(255, 59, 48),
}

const palette7 = {
    playfieldColor: new Color(99, 50, 110),
    snakeColor: new Color(242, 243, 174),
    itemColor: new Color(255, 82, 27),
    poopColor: new Color(255, 0, 0),
}

let activePalette = palette1

const levels = [
    {
        level: 1,
        gameSpeed: 200,
        colorPalette: palette1
    },
    {
        level: 2,
        gameSpeed: 150,
        colorPalette: palette2
    },
    {
        level: 3,
        gameSpeed: 110,
        colorPalette: palette3
    },
    {
        level: 4,
        gameSpeed: 80,
        colorPalette: palette4
    },
    {
        level: 5,
        gameSpeed: 65,
        colorPalette: palette5
    },
    {
        level: 55,
        gameSpeed: 1,
        colorPalette: palette6
    },
    {
        level: 7,
        gameSpeed: 45,
        colorPalette: palette7
    },
]

const snakeStartPosition = [
    {
        x: 0,
        y: 1.5,
        demoMoves: ['right','up','right','right','down','down','down','left','left','left','up','up'],
        type: 'snake'
    },
    {
        x: 0,
        y: 1,
        moves: ['up'],
        demoMoves: ['up','right','up','right','right','down','down','down','left','left','left','up'],
        type: 'snake'
    },
    {
        x: 0,
        y: 0.5,
        moves: ['up','up'],
        demoMoves: ['up','up','right','up','right','right','down','down','down','left','left','left'],
        type: 'snake'
    }
]

let snake = structuredClone(snakeStartPosition)

let item = {
    x: 5,
    y: 5,
    type: 'item'
}

let poop = {
    x: -1,
    y: -1,
    type: 'poop'
}

const keyDownHandler = (event) => {
    event.preventDefault()
    if(allowDirectionChange){
        if(event.key === 'd' || event.key === 'ArrowRight') {  
            rightPressed = true
            if(direction !== 'up') {
                direction = 'down'
                allowDirectionChange = false
            }
        }
        else if(event.key === 'a' || event.key === 'ArrowLeft') {
            leftPressed = true
            if(direction !== 'down')
            direction = 'up'
            allowDirectionChange = false
        }
        if(event.key === 's' || event.key === 'ArrowDown') {
            downPressed = true
            if(direction !== 'right'){
                direction = 'left'
                allowDirectionChange = false
            }
        }
        else if(event.key === 'w' || event.key === 'ArrowUp') {
            upPressed = true
            if(direction !== 'left'){
                direction = 'right'
                allowDirectionChange = false
            }   
        }
    }
    
}

const keyUpHandler = (event) => {
    event.preventDefault()
    if(event.key === 'd' || event.key === 'ArrowRight') {
        rightPressed = false
    }
    else if(event.key === 'a' || event.key === 'ArrowLeft') {
        leftPressed = false
    }
    if(event.key === 's' || event.key === 'ArrowDown') {
        downPressed = false
    }
    else if(event.key === 'w' || event.key === 'ArrowUp') {
        upPressed = false
    }
}

const moveSnake = (demo) => {
    snake.forEach((element, index) => {
        if (!demo && index === 0) return

        const moves = demo ? element.demoMoves : element.moves
        if (moves.length === 0) return

        if (moves[0] === 'up') element.y += 0.5
        if (moves[0] === 'down') element.y -= 0.5
        if (moves[0] === 'left') element.x -= 0.5
        if (moves[0] === 'right') element.x += 0.5

        const currentMove = moves.shift()
        if (demo) {
            element.demoMoves.push(currentMove)
        } else {
            element.moves.push(direction)
        }
    })
    allowDirectionChange = true
}

const moveSnakeHead = () => {
    const snakeHead = snake[0]
    if(direction === 'up') {
        snakeHead.y += 0.5
    }
    if(direction === 'down') {
        snakeHead.y -= 0.5
    }
    if(direction === 'right') {
        snakeHead.x += 0.5
    }
    if(direction === 'left') {
        snakeHead.x -= 0.5
    }
    itemCollision(item)
}

const replaceItem = () => {
    itemCollected = false

    let newX, newY

    do {
        newX = generateRandomIntegerInRange(0, 7)
        newY = generateRandomIntegerInRange(0, 7)
    } while (newX === item.x && newY === item.y)

    item.x = newX
    item.y = newY
}

const generateRandomIntegerInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const itemCollision = () => {
    if(collision(item) && !itemCollected){
        score += 1
        scoreBoard.innerHTML = score
        itemCollected = true
        poop.x = item.x
        poop.y = item.y
        let clonedMoves = [...snake[snake.length - 1].moves]
        clonedMoves.unshift('')
        snake.push({
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y,
            moves: clonedMoves,
            type: 'snake'
        })

        setTimeout(
            replaceItem,1000
        )

        if(score%5 === 0){
            level += 1
            const levelData = levels.find(levelObject => levelObject.level === level)
            if (!levelData) return
            gameSpeed = levelData.gameSpeed ?? gameSpeed
            changeColorPalette(levelData.colorPalette)
            clearInterval(gameInterval)
            gameInterval = setInterval(runGame,gameSpeed)
            document.getElementById('level').innerHTML = level
        }
    }
}

const changeColorPalette = (palette) => {
    activePalette = palette
}

const collision = (element) => {
    const snakeHead = snake[0]
    return element.x + 0.5 > snakeHead.x && element.x < snakeHead.x + 0.5 && element.y + 0.5 > snakeHead.y && element.y < snakeHead.y + 0.5
}

const drawPlayfield = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    iso.add(
        Shape.Prism(new Point(0,0,-1),8,8,1),activePalette.playfieldColor
    )
}

const drawSnake = (height) => {
    let snakeClone = structuredClone(snake)
    snakeClone.push(item)
    snakeClone.push(poop)
    snakeClone.sort(function(a,b){
        return b.x - a.x
    })
    snakeClone.sort(function(a,b){
        return b.y - a.y
    })

    snakeClone.forEach(element => {
        if(element.type === 'snake'){
            iso.add(
            Shape.Prism(new Point(0 + element.x,element.y,0), 0.5, 0.5, height),activePalette.snakeColor
        )
        } else {
            if(element.type === 'poop' && element.x >= 0){
                iso.add(
                    Shape.Pyramid(new Point(poop.x,poop.y,0), 0.5, 0.5, 0.5),activePalette.poopColor
                )
            }    
            else if (element.type === 'item' && !itemCollected){
            iso.add(
                Shape.Prism(new Point(0 + element.x,element.y,0), 0.5, 0.5, 0.5),activePalette.itemColor
            )
        }}
            
    }
)}

const runGame = ()=>{
    drawPlayfield()
    drawSnake(0.5)
    moveSnakeHead()
    moveSnake(false)
    checkGameOver()
    setCanvasSize()
}

const startGame = () => {
    clearInterval(demo)
    snake = structuredClone(snakeStartPosition)
    gameInterval = setInterval(runGame,gameSpeed)
    messageBox.innerHTML = ''
}

const checkGameOver = () => {
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

const animateGameOver = () => {
    let height = 0.5
    let animation = setInterval(()=>{
        drawPlayfield()
        drawSnake(height)
        messageBox.innerHTML = "<button onclick='location.reload()'>RETRY</button>"
        if(height > 0){
            height -= 0.01
        } else clearInterval(animation)
    },1000/60)
}

const setCanvasSize = () => {
    canvas.innerWidth = document.getElementById('canvas-wrapper').clientWidth
    canvas.innerHeight = 0.7 * document.getElementById('canvas-wrapper').clientWidth
}

setCanvasSize()

const showDemo = () => {
    moveSnake(true)
    drawPlayfield()
    drawSnake(0.5)
}

let demo = setInterval(showDemo,500)

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('resize', setCanvasSize, false)
window.addEventListener('keydown', (e) => {
    const keys = [' ', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
    if (keys.includes(e.key)) {
        e.preventDefault()
    }
}, false)