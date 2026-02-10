const marioBox = document.getElementById('homepage-running-mario')
const homepageMario = document.getElementById('homepage-mario')
const marioSound = document.getElementById('mario-sound')

if (marioBox && homepageMario) {
  let marioLeft = -60
  let spritesheetPosition = 0
  let sheetMovement = 50

  const movingBox = () => {
    marioBox.style.transform = `translateX(${marioLeft}px)`
    if (marioLeft < window.innerWidth) marioLeft += 2
    if (marioLeft >= window.innerWidth) marioLeft = -500
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

  setInterval(movingBox, 1000 / 60)
  setInterval(animateMario, 102)
  homepageMario.addEventListener('click', itsMeMario)
}
