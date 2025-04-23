// html elements

const colorSelect = document.getElementById("color-select")
const lineSelect = document.getElementById("line-width")
const rainbowBTN = document.getElementById("rainbow-button")
const saveBTN = document.getElementById("save-button")
const rainbowIMG = document.getElementById("rainbow-img")
const deleteBTN = document.getElementById("delete-button")
const eraseBTN = document.getElementById("erase-button")
const eraseIMG = document.getElementById("erase-img")

const canvas = document.getElementById("game-canvas")
const canvasContext = canvas.getContext("2d")

// global variables

let p1X
let p1Y
let isRainbow = false
let isErasing = false
let isDrawing = false
let startedDrawing = false

// functions

const initialize = () => {
    setCanvasSize()
    canvasContext.fillStyle = 'white'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    window.addEventListener('resize', initialize)
    window.addEventListener('orientationchange', initialize)
    canvas.addEventListener('mousedown', setDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('touchstart', setDrawing)
    canvas.addEventListener('touchmove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseleave', stopDrawing)
    canvas.addEventListener('touchend', stopDrawing)
    saveBTN.addEventListener('click', saveDrawing)
    deleteBTN.addEventListener('click',deleteDrawing)
    rainbowBTN.addEventListener('click',toggleRainbow)
    eraseBTN.addEventListener('click',toggleErase)
    colorSelect.addEventListener('click', function(){
        isRainbow = false
        isErasing = false
        eraseIMG.style.opacity = '0.3'
        rainbowIMG.style.opacity = '0.3'
    })
    loadDrawing()
}


window.onload = () => {
    initialize()
    canvasContext.fillStyle = 'black'
    canvasContext.font = '40px myFont'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('Drawing App', canvas.width/2, canvas.height/2-20)
    canvasContext.font = '20px myFont'
    canvasContext.fillText('Tap or click to start', canvas.width/2, canvas.height/2+20)
    canvasContext.font = '40px Tahoma'
    canvasContext.fillText('🎨🖌️', canvas.width/2, canvas.height/2+90)
    canvasContext.lineCap = 'round'
    canvasContext.lineJoin = 'round'
}

const setCanvasSize = () => {
    canvas.width = window.innerWidth < 600 ? 0.8*window.innerWidth : 400
    canvas.height = window.innerWidth < 600 ? window.innerWidth : 500
    if(window.innerWidth < 1025 && window.innerWidth/window.innerHeight >0.7 ) {
        canvas.width = window.innerWidth*0.8
        canvas.height = window.innerWidth
    }
}

const loadDrawing = () => {
    if('drawing' in localStorage) {
        const drawingURL = localStorage.getItem('drawing')
        const image = new Image
        image.src = drawingURL
        image.onload = () => {
            canvasContext.drawImage(image,0,0)
        }
    }
}

const saveDrawing = () => {
    localStorage.setItem('drawing', canvas.toDataURL())
}

const deleteDrawing = () => {
    if('drawing' in localStorage){
        localStorage.removeItem('drawing')
    }
    canvasContext.fillStyle = 'white'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
}


const setDrawing = (event) => {
    event.preventDefault()

    if(!startedDrawing) initialize()

    startedDrawing = true
    isDrawing = true

    p1X = (event.targetTouches ? event.targetTouches[0].pageX - canvas.offsetLeft : event.offsetX)
    p1Y = (event.targetTouches ? event.targetTouches[0].pageY - canvas.offsetTop : event.offsetY)
    canvasContext.beginPath()
}

const draw = (event) => {
    event.preventDefault()

    if(isDrawing){
        const x = (event.targetTouches ? event.targetTouches[0].pageX - canvas.offsetLeft : event.offsetX)
        const y = (event.targetTouches ? event.targetTouches[0].pageY - canvas.offsetTop : event.offsetY)
        drawLine(x, y)
        p1X = x
        p1Y = y
    }
}

const toggleRainbow = () => {
    isRainbow = !isRainbow
    rainbowIMG.style.opacity = isRainbow ? '1' : '0.3'
    isErasing = false
    eraseIMG.style.opacity = '0.3'
}

const toggleErase = () => {
    isErasing = !isErasing
    eraseIMG.style.opacity = isErasing ? '1' : '0.3'
    isRainbow = false
    rainbowIMG.style.opacity = '0.3'
}

const drawLine = (x, y) => {
    let color = colorSelect.value

    if(isRainbow) {
        color = `hsl(${p1X}, 100%, 50%)`
    }

    if(isErasing) {
        color = 'white'
    }
    event.preventDefault()
    canvasContext.strokeStyle = color
    canvasContext.lineWidth = lineSelect.value
    const midX = (p1X + x) / 2
    const midY = (p1Y + y) / 2
    canvasContext.quadraticCurveTo(p1X, p1Y, midX, midY)
    canvasContext.stroke()
}

const stopDrawing = () => {
    event.preventDefault()
    if(isDrawing) {
        isDrawing = !isDrawing
    }
    canvasContext.closePath()
}