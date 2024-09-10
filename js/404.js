const jumpButton = document.getElementById("jump-button")
const jumpingBox = document.getElementById("jumping-box")
const jumpman = document.getElementById("jumping-mario")
const questionBlock = document.getElementById("question-block")
const coinSound = document.getElementById("coin")

let jumpingBoxPosition = 0
let jumpDirection = 12


let jumpAnimation
let isJumping = false

const makeTheJump = () => {
    setTimeout(() => window.location.href='https://eckeecke.github.io', 2000)
    if (isJumping) return
    jumpAnimation = setInterval(jump, 50)
}

const jump = () => {
    isJumping = true
    jumpman.style.left = "-50px"

    if (jumpingBoxPosition >= 30) {
        jumpman.style.left = "-100px"
    }
    
    if (jumpDirection == 3){
        questionBlock.style.top = "-2px"
        coinSound.play()
    }

    if (jumpDirection == -3){
        questionBlock.style.top = "7px"
    }

    if (jumpingBoxPosition == 0 && jumpDirection < 0){
        clearInterval(jumpAnimation)
        jumpDirection = 12
        jumpman.style.left = "0px"
        isJumping = false
    }

    jumpingBox.style.bottom = jumpingBoxPosition + "px"
    jumpDirection -= 1
    jumpingBoxPosition += jumpDirection
}

setTimeout(() => {
    if(!isJumping) makeTheJump()
}, 4000)