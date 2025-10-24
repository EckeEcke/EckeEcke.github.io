const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreBoard = document.getElementById('score')
const messageBox = document.getElementById('message')

const iso = new Isomer(canvas)
const Shape = Isomer.Shape
const Point = Isomer.Point
const Color = Isomer.Color
const Path = Isomer.Path

const buttonsPressed = {
    right: false,
    left: false,
    up: false,
    down: false,
}

const colorPalettes = {
    level1: {
        playfieldColor: new Color(51, 51, 51),
        playfieldColorDark: new Color(31, 31, 31),
        snakeColor: new Color(153, 153, 153),
        itemColor: new Color(255, 204, 0),
        poopColor: new Color(255, 59, 48),
    },
    level2: {
        playfieldColor: new Color(50, 98, 115),
        playfieldColorDark: new Color(30, 78, 95),
        snakeColor: new Color(238, 238, 238),
        itemColor: new Color(227, 151, 116),
        poopColor: new Color(255, 69, 58),
    },
    level3: {
        playfieldColor: new Color(58, 87, 67),
        playfieldColorDark: new Color(38, 67, 57),
        snakeColor: new Color(252, 236, 82),
        itemColor: new Color(59, 112, 128),
        poopColor: new Color(255, 59, 48),
    },
    level4: {
        playfieldColor: new Color(25, 11, 40),
        playfieldColorDark: new Color(5, 0, 20),
        snakeColor: new Color(104, 87, 98),
        itemColor: new Color(229, 83, 129),
        poopColor: new Color(255, 0, 0),
    },
    level5: {
        playfieldColor: new Color(57, 57, 58),
        playfieldColorDark: new Color(37, 37, 38),
        snakeColor: new Color(133, 255, 199),
        itemColor: new Color(255, 133, 82),
        poopColor: new Color(255, 0, 0),
    },
    level6: {
        playfieldColor: new Color(41, 23, 17),
        playfieldColorDark: new Color(21, 3, 0),
        snakeColor: new Color(141, 220, 164),
        itemColor: new Color(99, 50, 110),
        poopColor: new Color(255, 59, 48),
    },
    level7: {
        playfieldColor: new Color(99, 50, 110),
        playfieldColorDark: new Color(79, 30, 90),
        snakeColor: new Color(242, 243, 174),
        itemColor: new Color(255, 82, 27),
        poopColor: new Color(255, 0, 0),
    },
}

const levels = [
    {
        level: 1,
        gameSpeed: 200,
        colorPalette: colorPalettes.level1
    },
    {
        level: 2,
        gameSpeed: 150,
        colorPalette: colorPalettes.level2
    },
    {
        level: 3,
        gameSpeed: 110,
        colorPalette: colorPalettes.level3
    },
    {
        level: 4,
        gameSpeed: 80,
        colorPalette: colorPalettes.level4
    },
    {
        level: 5,
        gameSpeed: 65,
        colorPalette: colorPalettes.level5
    },
    {
        level: 55,
        gameSpeed: 1,
        colorPalette: colorPalettes.level6
    },
    {
        level: 7,
        gameSpeed: 45,
        colorPalette: colorPalettes.level7
    },
]

const gameState = {
    direction: 'up',
    allowDirectionChange: true,
    itemCollected: false,
    gameSpeed: 200,
    gameInterval: null,
    score: 0,
    level: 1,
    intervals: {
        game: null,
        demo: null,
    },
    activePalette: colorPalettes.level1,
}

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
    if(gameState.allowDirectionChange){
        if(event.key === 'd' || event.key === 'ArrowRight') {  
            buttonsPressed.right = true
            if(gameState.direction !== 'up') {
                gameState.direction = 'down'
                gameState.allowDirectionChange = false
            }
        }
        else if(event.key === 'a' || event.key === 'ArrowLeft') {
            buttonsPressed.left = true
            if(gameState.direction !== 'down')
            gameState.direction = 'up'
            gameState.allowDirectionChange = false
        }
        if(event.key === 's' || event.key === 'ArrowDown') {
            buttonsPressed.down = true
            if(gameState.direction !== 'right'){
                gameState.direction = 'left'
                gameState.allowDirectionChange = false
            }
        }
        else if(event.key === 'w' || event.key === 'ArrowUp') {
            buttonsPressed.up = true
            if(gameState.direction !== 'left'){
                gameState.direction = 'right'
                gameState.allowDirectionChange = false
            }   
        }
    }
}

const keyUpHandler = (event) => {
    event.preventDefault()
    if(event.key === 'd' || event.key === 'ArrowRight') {
        buttonsPressed.right = false
    }
    else if(event.key === 'a' || event.key === 'ArrowLeft') {
        buttonsPressed.left = false
    }
    if(event.key === 's' || event.key === 'ArrowDown') {
        buttonsPressed.down = false
    }
    else if(event.key === 'w' || event.key === 'ArrowUp') {
        buttonsPressed.up = false
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
            element.moves.push(gameState.direction)
        }
    })
    gameState.allowDirectionChange = true
}

const moveSnakeHead = () => {
    const snakeHead = snake[0]
    if(gameState.direction === 'up') {
        snakeHead.y += 0.5
    }
    if(gameState.direction === 'down') {
        snakeHead.y -= 0.5
    }
    if(gameState.direction === 'right') {
        snakeHead.x += 0.5
    }
    if(gameState.direction === 'left') {
        snakeHead.x -= 0.5
    }
    itemCollision(item)
}

const replaceItem = () => {
    gameState.itemCollected = false

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
    if(collision(item) && !gameState.itemCollected){
        gameState.score += 1
        scoreBoard.innerHTML = gameState.score
        gameState.itemCollected = true
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

        if(gameState.score % 5 === 0){
            gameState.level += 1
            const levelData = levels.find(levelObject => levelObject.level === gameState.level)
            if (!levelData) return
            gameState.gameSpeed = levelData.gameSpeed ?? gameState.gameSpeed
            changeColorPalette(levelData.colorPalette)
            clearInterval(gameState.gameInterval)
            gameState.gameInterval = setInterval(runGame,gameState.gameSpeed)
            document.getElementById('level').innerHTML = gameState.level
        }
    }
}

const changeColorPalette = (palette) => {
    gameState.activePalette = palette
}

const collision = (element) => {
    const snakeHead = snake[0]
    return element.x + 0.5 > snakeHead.x && element.x < snakeHead.x + 0.5 && element.y + 0.5 > snakeHead.y && element.y < snakeHead.y + 0.5
}

const drawPlayfield = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const size = 8;
    const baseHeight = 1;
    const baseZ = -1

    const lightColor = gameState.activePalette.playfieldColor
    const darkColor = gameState.activePalette.playfieldColorDark

    iso.add(
        Shape.Prism(new Point(0, 0, baseZ), size, size, baseHeight),
        lightColor
    );

    const topSurfaceZ = baseZ + baseHeight;

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if ((x + y) % 2 !== 0) {
                iso.add(
                    Shape.Prism(new Point(x, y, topSurfaceZ), 1, 1, 0.01),
                    darkColor
                )
            }
        }
    }
}

const drawElements = (height) => {
    const orderedElements = structuredClone(snake)
    orderedElements.push(item)
    orderedElements.push(poop)
    orderedElements.sort(function(a,b){
        return b.x - a.x
    })
    orderedElements.sort(function(a,b){
        return b.y - a.y
    })

    orderedElements.forEach(element => {
        if(element.type === 'snake'){
            iso.add(
            Shape.Prism(new Point(0 + element.x,element.y,0), 0.5, 0.5, height),gameState.activePalette.snakeColor)
            let outlinePath = new Path([
                Point(element.x, element.y, height),
                Point(element.x + 0.5, element.y, height),
                Point(element.x, element.y + 0.5, height),
                Point(element.x + 0.5, element.y + 0.5, height)
            ])
            outlinePath.closed = true

            const isHead = snake.findIndex(part => part.x === element.x && part.y === element.y) === 0
            const currentMove = isHead ? gameState.direction : (element.moves && element.moves[0])

            if (currentMove === 'left' || currentMove === 'right') {
                const centerOfRotation = new Point(
                    element.x + 0.5 / 2,
                    element.y + 0.5 / 2,
                    height
                )

                const angleInRadians = 90 * Math.PI / 180

                outlinePath = outlinePath.rotateZ(centerOfRotation, angleInRadians)
            }
            iso.add(outlinePath, new Color(0, 0, 0, 0.5))
        } else {
            if(element.type === 'poop' && element.x >= 0){
                iso.add(
                    Shape.Pyramid(new Point(poop.x,poop.y,0), 0.5, 0.5, 0.5),gameState.activePalette.poopColor
                )
            }    
            else if (element.type === 'item' && !gameState.itemCollected){
                iso.add(
                    Shape.Prism(new Point(0 + element.x,element.y,0), 0.5, 0.5, 0.5),gameState.activePalette.itemColor
                )
                iso.add(Shape.extrude(new Path([
                    Point(element.x + 0.25, element.y + 0.25, 0.5),
                    Point(element.x + 0.25, element.y, 0.5),
                    Point(element.x + 0.25, element.y + 0.25, 0.75)
                ]), 0.3), new Color(50, 160, 60))
        }}
            
    }
)}

const runGame = ()=>{
    drawPlayfield()
    drawElements(0.5)
    moveSnakeHead()
    moveSnake(false)
    checkGameOver()
}

const startGame = () => {
    clearInterval(gameState.intervals.demo)
    snake = structuredClone(snakeStartPosition)
    gameState.gameInterval = setInterval(runGame,gameState.gameSpeed)
    messageBox.innerHTML = ''
}

const checkGameOver = () => {
    const snakeHead = snake[0]
    if(snakeHead.y > 7.5 || snakeHead.y < 0 || snakeHead.x > 7.5 || snakeHead.x < 0){
        clearInterval(gameState.gameInterval)
        animateGameOver()
    }
    snake.forEach((element,index)=>{
        if (index === 0 && collision(poop) && !gameState.itemCollected){
            clearInterval(gameState.gameInterval)
            animateGameOver()
        }
        if(index > 0){
            if(collision(element)){
                clearInterval(gameState.gameInterval)
                animateGameOver()
            }
        }
    })
}

const animateGameOver = () => {
    let height = 0.5
    const animation = setInterval(()=>{
        drawPlayfield()
        drawElements(height)
        messageBox.innerHTML = "<button onclick='location.reload()'>RETRY</button>"
        if(height > 0){
            height -= 0.01
        } else clearInterval(animation)
    },1000/60)
}

const showDemo = () => {
    moveSnake(true)
    drawPlayfield()
    drawElements(0.5)
}

gameState.intervals.demo = setInterval(showDemo,500)

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
window.addEventListener('keydown', (e) => {
    const keys = [' ', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
    if (keys.includes(e.key)) {
        e.preventDefault()
    }
}, false)