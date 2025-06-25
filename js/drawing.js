const colorSelect = document.getElementById("color-select")
const lineSelect = document.getElementById("line-width")
const saveButton = document.getElementById("save-button")
const drawButton = document.getElementById("draw-button")
const deleteButton = document.getElementById("delete-button")
const eraseButton = document.getElementById("erase-button")
const bucketButton = document.getElementById("bucket-button")
const canvas = document.getElementById("game-canvas")
const canvasContext = canvas.getContext("2d")

let p1X
let p1Y
let isErasing = false
let isDrawing = false
let startedDrawing = false
let isBucketMode = false

let drawings

fetch('https://drawings-backend.vercel.app/api/getDrawings')
    .then(response => response.json())
    .then(data => drawings = data)
    .then(() => {
        displayDrawingsGallery()
    })
    .catch()

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
    saveButton.addEventListener('click', saveDrawing)
    deleteButton.addEventListener('click', deleteDrawing)
    drawButton.addEventListener('click', toggleDraw)
    eraseButton.addEventListener('click', toggleErase)
    bucketButton.addEventListener('click', toggleBucket)

    loadDrawing()
}

window.onload = () => {
    initialize()
    canvasContext.fillStyle = '#643579'
    canvasContext.font = '40px myFont'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('Drawing App', canvas.width/2, canvas.height/2-20)
    canvasContext.font = '20px myFont'
    canvasContext.fillText('Tap or click to start', canvas.width/2, canvas.height/2+20)
    canvasContext.font = '40px Tahoma'
    canvasContext.fillText('🎨🖌️', canvas.width/2, canvas.height/2+90)
    canvasContext.lineCap = 'round'
    canvasContext.lineJoin = 'round'
    document.getElementById('gallery-button').addEventListener('click', toggleDisplay)
    document.getElementById('drawing-button').addEventListener('click', toggleDisplay)
}

function toggleDisplay() {
    document.getElementById('gallery-wrapper').classList.toggle('hidden')
    document.getElementById('wrapper').classList.toggle('hidden')
    document.getElementById('gallery-button').classList.toggle('active')
    document.getElementById('drawing-button').classList.toggle('active')
}

const setCanvasSize = () => {
    canvas.width = window.innerWidth < 400 ? 0.8*window.innerWidth : 400
    canvas.height = window.innerWidth < 400 ? window.innerWidth : 500
    if(window.innerWidth < 800 && window.innerWidth/window.innerHeight > 0.7) {
        canvas.width = window.innerWidth*0.8
        canvas.height = window.innerWidth
    }
}

const loadDrawing = () => {
    if('drawing' in localStorage) {
        const drawingURL = localStorage.getItem('drawing')
        const image = new Image()
        image.src = drawingURL
        image.onload = () => {
            canvasContext.drawImage(image,0,0)
        }
    }
}

const saveDrawing = () => {
    const confirmed = confirm('Do you want to post your drawing in the drawings gallery?')
    if (confirmed) {
        fetch('https://drawings-backend.vercel.app/api/postDrawing', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                image: canvas.toDataURL(),
                createdAt: new Date().toISOString(),
                creator: 'Chris',
            })
        })
            .then(response => response.json())
            .catch(err => console.log(err))

        drawings.push({
            image: canvas.toDataURL(),
            createdAt: new Date().toISOString(),
            creator: 'Chris',
        })
        displayDrawingsGallery()
        toggleDisplay()
        saveButton.disabled = true
    }
    localStorage.setItem('drawing', canvas.toDataURL())
}

const deleteDrawing = () => {
    if('drawing' in localStorage) {
        localStorage.removeItem('drawing')
    }
    saveButton.disabled = true
    canvasContext.fillStyle = 'white'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
}

const toggleBucket = () => {
    isBucketMode = !isBucketMode
    bucketButton.style.opacity = isBucketMode ? '1' : '0.3'

    isErasing = false
    eraseButton.style.opacity = '0.3'
    drawButton.style.opacity = !isBucketMode ? '1' : '0.3'
}

const setDrawing = (event) => {
    event.preventDefault()
    if(!startedDrawing) initialize()
    startedDrawing = true
    saveButton.disabled = false

    const x = Math.floor(event.targetTouches ?
        event.targetTouches[0].pageX - canvas.offsetLeft :
        event.offsetX)
    const y = Math.floor(event.targetTouches ?
        event.targetTouches[0].pageY - canvas.offsetTop :
        event.offsetY)

    if(isBucketMode) {
        let fillColor = colorSelect.value
        floodFill(x, y, fillColor)
        return
    }

    isDrawing = true
    p1X = x
    p1Y = y
    canvasContext.beginPath()
}

const draw = (event) => {
    event.preventDefault()

    if(isBucketMode) return

    if(isDrawing){
        const x = (event.targetTouches ? event.targetTouches[0].pageX - canvas.offsetLeft : event.offsetX)
        const y = (event.targetTouches ? event.targetTouches[0].pageY - canvas.offsetTop : event.offsetY)
        drawLine(x, y)
        p1X = x
        p1Y = y
    }
}

const toggleDraw = () => {
    drawButton.style.opacity = '1'
    isErasing = false
    isBucketMode = false
    eraseButton.style.opacity = '0.3'
    bucketButton.style.opacity = '0.3'
}

const toggleErase = () => {
    isErasing = !isErasing
    eraseButton.style.opacity = isErasing ? '1' : '0.3'
    isBucketMode = false
    drawButton.style.opacity = '0.3'
    bucketButton.style.opacity = '0.3'
    drawButton.style.opacity = '0.3'
}

const drawLine = (x, y) => {
    let color = colorSelect.value

    if(isErasing) {
        color = 'white'
    }

    canvasContext.strokeStyle = color
    canvasContext.lineWidth = lineSelect.value
    const midX = (p1X + x) / 2
    const midY = (p1Y + y) / 2
    canvasContext.quadraticCurveTo(p1X, p1Y, midX, midY)
    canvasContext.stroke()
}

const stopDrawing = (event) => {
    if (event) event.preventDefault()
    if(isDrawing) {
        isDrawing = false
    }
    canvasContext.closePath()
}

const floodFill = (startX, startY, fillColor) => {
    const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height

    const startPos = (startY * width + startX) * 4
    const startR = data[startPos]
    const startG = data[startPos + 1]
    const startB = data[startPos + 2]
    const startA = data[startPos + 3]

    let fillR, fillG, fillB, fillA = 255

    if (fillColor === 'white') {
        fillR = fillG = fillB = 255
    } else if (fillColor.startsWith('#')) {
        const hex = fillColor.replace('#', '')
        if (hex.length === 3) {
            fillR = parseInt(hex.charAt(0) + hex.charAt(0), 16)
            fillG = parseInt(hex.charAt(1) + hex.charAt(1), 16)
            fillB = parseInt(hex.charAt(2) + hex.charAt(2), 16)
        } else {
            fillR = parseInt(hex.substring(0, 2), 16)
            fillG = parseInt(hex.substring(2, 4), 16)
            fillB = parseInt(hex.substring(4, 6), 16)
        }
    } else if (fillColor.startsWith('hsl')) {
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCtx.fillStyle = fillColor
        tempCtx.fillRect(0, 0, 1, 1)
        const tempData = tempCtx.getImageData(0, 0, 1, 1).data
        fillR = tempData[0]
        fillG = tempData[1]
        fillB = tempData[2]
    }

    if (Math.abs(startR - fillR) < 5 &&
        Math.abs(startG - fillG) < 5 &&
        Math.abs(startB - fillB) < 5) {
        return
    }

    const tolerance = 10

    const pixelsToCheck = []
    pixelsToCheck.push(startPos)

    const visited = new Set()

    while(pixelsToCheck.length > 0) {
        const currentPos = pixelsToCheck.pop()

        if(visited.has(currentPos)) continue
        visited.add(currentPos)

        const x = Math.floor((currentPos / 4) % width)
        const y = Math.floor((currentPos / 4) / width)

        const r = data[currentPos]
        const g = data[currentPos + 1]
        const b = data[currentPos + 2]
        const a = data[currentPos + 3]

        if(Math.abs(r - startR) <= tolerance &&
            Math.abs(g - startG) <= tolerance &&
            Math.abs(b - startB) <= tolerance &&
            Math.abs(a - startA) <= tolerance) {

            data[currentPos] = fillR
            data[currentPos + 1] = fillG
            data[currentPos + 2] = fillB
            data[currentPos + 3] = fillA

            if(x > 0) pixelsToCheck.push(currentPos - 4)
            if(x < width - 1) pixelsToCheck.push(currentPos + 4)
            if(y > 0) pixelsToCheck.push(currentPos - width * 4)
            if(y < height - 1) pixelsToCheck.push(currentPos + width * 4)
        }
    }

    canvasContext.putImageData(imageData, 0, 0)
}

const displayDrawingsGallery = () => {
    let galleryContainer = document.getElementById('drawings-gallery')
    if (!galleryContainer) {
        galleryContainer = document.createElement('div')
        galleryContainer.id = 'drawings-gallery'
        document.body.appendChild(galleryContainer)
    } else {
        galleryContainer.innerHTML = ''
    }

    drawings.forEach((entry) => {
        const img = new Image()
        img.src = entry.image
        galleryContainer.appendChild(img)
    })
}