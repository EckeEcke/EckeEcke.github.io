const marioBox = document.getElementById('homepage-running-mario')
const homepageMario = document.getElementById('homepage-mario')
const marioSound = document.getElementById('mario-sound')

if (marioBox && homepageMario) {
  let marioLeft = -60
  let spritesheetPosition = 0
  let sheetMovement = 50
  let isMoving = true

  const moveBox = () => {
    if (!isMoving) return
    marioBox.style.transform = `translateX(${marioLeft}px)`
    if (marioLeft < window.innerWidth) marioLeft += 2
    if (marioLeft >= window.innerWidth) {
      isMoving = false
      marioLeft = -100
      setTimeout(() => isMoving = true, 20000)
    }
  }

  const animateMario = () => {
    spritesheetPosition += sheetMovement
    homepageMario.style.transform = `translateX(${-spritesheetPosition}px)`
    if (spritesheetPosition === 100) sheetMovement = -50
    if (spritesheetPosition === 0) sheetMovement = 50
  }

  const itsMeMario = () => {
    marioSound.volume = 0.2
    marioSound.play()
  }

  setInterval(moveBox, 1000 / 60)
  setInterval(animateMario, 102)
  homepageMario.addEventListener('click', itsMeMario)
}
