const marioBox = document.getElementById('homepage-running-mario')
const homepageMario = document.getElementById('homepage-mario')

let marioLeft = -60

const movingBox = () => {
  marioBox.style.transform = `translateX(${marioLeft}px)`

  if(marioLeft < window.innerWidth){
    marioLeft += 2
  }

  if(marioLeft >= window.innerWidth){
    marioLeft = -500
  }
}

setInterval(movingBox, 1000/60)

let spritesheetPosition = 0
let sheetMovement = 50

const animateMario = () => {
  spritesheetPosition += sheetMovement
  homepageMario.style.transform = `translateX(${-spritesheetPosition}px)`

  if(spritesheetPosition === 100){
    sheetMovement = -50
  }

  if(spritesheetPosition === 0){
    sheetMovement = 50
  }
}

setInterval(animateMario, 102)


const itsMeMario = () => {
  document.getElementById("mario-sound").volume = 0.2
  document.getElementById("mario-sound").play()
}