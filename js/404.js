const CONFIG = {
  BASE_URL: window.location.origin,
  REDIRECT_DELAY: 2000,
  AUTO_JUMP_DELAY: 4000,
}

const jumpingBox = document.getElementById('jumping-box')
const jumpMan = document.getElementById('jumping-mario')
const questionBlock = document.getElementById('question-block')
const coinSound = document.getElementById('coin')

if (jumpingBox && jumpMan && questionBlock && coinSound) {
  let jumpingBoxPosition = 0
  let jumpDirection = 12
  let jumpAnimation
  let isJumping = false

  const jump = () => {
    isJumping = true
    jumpMan.style.left = '-50px'

    if (jumpingBoxPosition >= 30) {
      jumpMan.style.left = '-100px'
    }

    if (jumpDirection === 3) {
      questionBlock.style.top = '-2px'
      coinSound.play()
    }

    if (jumpDirection === -3) {
      questionBlock.style.top = '7px'
    }

    if (jumpingBoxPosition === 0 && jumpDirection < 0) {
      clearInterval(jumpAnimation)
      jumpDirection = 12
      jumpMan.style.left = '0px'
      isJumping = false
    }

    jumpingBox.style.bottom = jumpingBoxPosition + 'px'
    jumpDirection -= 1
    jumpingBoxPosition += jumpDirection
  }

  const makeTheJump = () => {
    setTimeout(() => {
      window.location.href = CONFIG.BASE_URL + '/'
    }, CONFIG.REDIRECT_DELAY)
    if (isJumping) return
    jumpAnimation = setInterval(jump, 50)
  }

  jumpMan.addEventListener('click', makeTheJump)
  questionBlock.addEventListener('click', makeTheJump)

  setTimeout(() => {
    if (!isJumping) makeTheJump()
  }, CONFIG.AUTO_JUMP_DELAY)
}
