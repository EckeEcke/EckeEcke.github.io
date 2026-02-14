const marioBox = document.getElementById('homepage-running-mario')
const homepageMario = document.getElementById('homepage-mario')
const marioSound = document.getElementById('mario-sound')

if (marioBox && homepageMario) {
    let marioLeft = -500
    let spritesheetPosition = 0
    let sheetMovement = 50
    let isMoving = true
    let lastSpriteUpdate = 0

    const animate = (timestamp) => {
        if (isMoving) {
            marioLeft += 2
            marioBox.style.transform = `translateX(${marioLeft}px)`

            if (timestamp - lastSpriteUpdate > 102) {
                spritesheetPosition += sheetMovement
                homepageMario.style.transform = `translateX(${-spritesheetPosition}px)`
                
                if (spritesheetPosition === 100) sheetMovement = -50
                if (spritesheetPosition === 0) sheetMovement = 50
                
                lastSpriteUpdate = timestamp
            }

            if (marioLeft >= window.innerWidth || marioBox.style.display === 'none') {
                isMoving = false
                marioLeft = -500
                setTimeout(() => {
                    isMoving = true
                    marioBox.style.display = 'block'
                }, 30000)
            }
        }
        requestAnimationFrame(animate)
    }

    const itsMeMario = () => {
        marioSound.volume = 0.2
        marioSound.currentTime = 0
        marioSound.play()
    }

    homepageMario.addEventListener('click', itsMeMario)

    window.addEventListener('resize', () => {
        marioLeft = -500
        marioBox.style.display = 'none'
    })

    requestAnimationFrame(animate)
}