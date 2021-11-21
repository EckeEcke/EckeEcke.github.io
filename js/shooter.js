
const canvas = document.getElementById("game-canvas");
const canvasContext = canvas.getContext("2d");
const soundBTN = document.getElementById("sound-button");
let spaceshipX = 150;
let spaceshipY = 580;
let canonY = 520;
let canonX = spaceshipX + 50;
let shotX;
let shotY;
let aPressed = false;
let dPressed = false;
let wPressed = false;
let shotFired = false;
let sPressed = false;
let playerKilled = false

let touchX;
let touchControls = false;

let score = 0;
let color = 0;


asteroidImage = new Image();
asteroidImage.src = "./images/asteroid.png";
asteroidImage2 = new Image();
asteroidImage2.src = "./images/asteroid.png";
asteroidImage3 = new Image();
asteroidImage3.src = "./images/asteroid.png";
asteroidImage4 = new Image();
asteroidImage4.src = "./images/asteroid.png";

let asteroid = {
  x: 100,
  y: -50,
  hit: false,
  image: asteroidImage,
  countBlocker: false
}

let asteroid2 = {
  x: 200,
  y: -100,
  hit: false,
  image: asteroidImage2,
  countBlocker: false
}

let asteroid3 = {
  x: 300,
  y: -200,
  hit: false,
  image: asteroidImage3,
  countBlocker: false
}

let asteroid4 = {
  x: 150,
  y: -300,
  hit: false,
  image: asteroidImage4,
  countBlocker: false
}

let enemyshipCount = 0;
let enemyRequired = 6;

let snake = {
  head: {
    x: 0,
    y: 0,
    speed: 10,
    lives: 1
  },
  body2: {
    x: 40,
    y: 0,
    speed: 10,
    lives: 2
  },
  body3: {
    x: 80,
    y: 0,
    speed: 10,
    lives: 3
  },
  body4: {
    x: 120,
    y: 0,
    speed: 10,
    lives: 4
  },
  body5: {
    x: 160,
    y: 0,
    speed: 10,
    lives: 5
  },
  body6: {
    x: 180,
    y: 0,
    speed: 10,
    lives: 6
  },
  body7: {
    x: 220,
    y: 0,
    speed: 10,
    lives: 7
  },
  body8: {
    x: 260,
    y: 0,
    speed: 10,
    lives: 8
  }
}

let enemyShip1 = {
  x: 0,
  y: 60,
  speed: 1.5,
  lives: 1,
  shotFired: false,
}

let enemyShip2 = {
  x: 260,
  y: 120,
  speed: -1.5,
  lives: 1,
  shotFired: false
}

function moveEnemyShip(obj) {
  obj.x += obj.speed;
  if (obj.x <= 0 || obj.x >= canvas.width - 40) {
    obj.speed = obj.speed * (-1);
  }
}

function drawEnemyShip(obj) {
  if (obj.lives > 0) {
    canvasContext.drawImage(enemyShipImage1, obj.x, obj.y, 50, 50);
  }
  if (obj.lives % 1 !== 0) {
    canvasContext.drawImage(explosion, obj.x, obj.y, 50, 50);
  }
}
function drawEnemyShots(obj, target) {
  if (obj.x + 20 >= target && obj.x <= target + 20 && obj.shotFired == false && obj.lives >= 1) {
    obj.shotX = obj.x
    obj.shotX2 = obj.x + 30
    obj.shotY = obj.y
    obj.shotFired = true
    laserEnemy.play()
  }
  if (obj.shotFired) {
    obj.shotY += 2
    canvasContext.fillStyle = "red";
    canvasContext.fillRect(obj.shotX, obj.shotY, 10, 20);
    canvasContext.fillRect(obj.shotX2, obj.shotY, 10, 20);
  }
  if (obj.shotY > canvas.height) {
    obj.shotFired = false
  }
  if (spaceshipY < obj.shotY + 30 && spaceshipY + 10 > obj.shotY && spaceshipX + 10 < obj.shotX + 30 && spaceshipX + 80 > obj.shotX + 20 && obj.lives >= 1) {
    displayGameoverScreen()
  }
}

function drawShipEnemies() {
  drawEnemyShip(enemyShip1);
  moveEnemyShip(enemyShip1);
  drawEnemyShots(enemyShip1, spaceshipX)
  hitDetectionShip(enemyShip1)
  drawEnemyShip(enemyShip2);
  moveEnemyShip(enemyShip2);
  drawEnemyShots(enemyShip2, spaceshipX)
  hitDetectionShip(enemyShip2)
  if (enemyShip1.lives <= 0 && enemyShip2.lives <= 0) {
    enemyShip1.shotFired = false
    enemyShip2.shotFired = false
    enemyShip1.speed *= 1.1
    enemyShip2.speed *= 1.1
    startNextRound(moveSnake)
  }
}

let hit;
let snakeLives = 8;
let gameSpeed = 40;
let backgroundScrollPosition = -300;

let intervalSnake;
let intervalBackground;

let highScore;
let isHighscore = false;
let soundsMuted = false;
let gameLoaded = 0;

let shipRound = false
let snakeRound = false;
let asteroidRound = true;
let bonusScore = 0;

let streak = 0;
let multiplier;
let shotcolor;

let loadingAnimation = ".";

let highscores = [];
let showHighscores = false;
let highscoresLoaded = false;
let timer = 0;

function soundControl() {
  soundsMuted = !soundsMuted;
  if (!soundsMuted) {
    soundBTN.innerHTML = "&#128266;";
  } else {
    soundBTN.innerHTML = "&#128263;";
  }
}

function loadImages() {
  snakeHead = new Image();
  snakeHead.src = "./images/snake-head.png";
  snakeBody = new Image();
  snakeBody.src = "./images/snake.png";
  enemyShipImage1 = new Image();
  enemyShipImage1.src = "./images/enemyship.png";
  trumphead = new Image();
  trumphead.src = "./images/trumphead.png";
  background = new Image();
  background.src = "./images/space-pixel-background.jpg";
  spaceship = new Image();
  spaceship.src = "./images/spaceship.png";
  explosion = new Image();
  explosion.src = "./images/explosion.png";

}

function loadSounds() {
  laserEnemy = new Audio("./sounds/laser-enemy.wav")
  laser = new Audio("./sounds/laser.wav");
  laser.onloadeddata = () => gameLoaded += 10;
  laser2 = new Audio("./sounds/laser2.wav");
  laser2.onloadeddata = () => gameLoaded += 10;
  laser3 = new Audio("./sounds/laser3.wav");
  laser3.onloadeddata = () => gameLoaded += 10;
  powerup = new Audio("./sounds/shooter-powerup.wav");
  powerup.onloadeddata = () => gameLoaded += 10;
  alertSound = new Audio("./sounds/alert.wav");
  alertSound.onloadeddata = () => gameLoaded += 10;
  hitSound = new Audio("./sounds/hit.wav");
  hitSound.onloadeddata = () => gameLoaded += 10;
  spaceshipSound = new Audio("./sounds/spaceship-rising.wav");
  spaceshipSound.onloadeddata = () => gameLoaded += 10;
  loseSound = new Audio("./sounds/lose-shooter.wav");
  loseSound.onloadeddata = () => gameLoaded += 10;
  gameMusic = new Audio("./sounds/spaceshooter-music.mp3");
  gameMusic.onloadeddata = () => gameLoaded += 10;
  gameMusic.loop = true;
}

function playSound(sound) {
  if (!soundsMuted) {
    sound.volume = 0.9;
  } else {
    sound.volume = 0;
  }
}

window.onload = function () {
  if (!highscoresLoaded) {
    fetch('https://highscore-db.herokuapp.com/')
      .then(response => response.json())
      .then(data => highscores = data)
      .then(() => highScore = highscores[0].Score)
      .then(highscoresLoaded = true)
      .then(gameLoaded += 10);
  }

  loadImages();
  loadSounds();
  canvas.addEventListener("touchstart", changeTouchPosition, false);
  canvas.addEventListener("touchmove", changeTouchPosition, false);
  canvas.addEventListener("touchend", function () { touchControls = false });
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("keydown", event => {
    if (event.keyCode === 83 && !sPressed && gameLoaded >= 100 && highscoresLoaded) {
      score = 0;
      startGame(moveAsteroids);
      sPressed = true;
    }
  });
  intervalStartscreen = setInterval(displayStartscreen, 500);

}

function displayHighscores() {

  for (let i; i < 10; i++) {
    canvasContext.fillText(highscores[i].Player, 20, i * 50 + 50);
  }

}

function displayStartscreen() {
  timer += 1;
  if (!highscoresLoaded) {
    fetch('https://highscore-db.herokuapp.com/')
      .then(response => response.json())
      .then(data => highscores = data)
      .then(() => highScore = highscores[0].Score)
      .then(highscoresLoaded = true);
  }
  if (timer % 10 == 0 && highscoresLoaded) {
    showHighscores = !showHighscores;
  }
  if (!showHighscores) {
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "black"; /*black background*/
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "24px retro";
    canvasContext.fillStyle = "limegreen";
    canvasContext.fillText(gameLoaded < 100 ? `Loading: ${gameLoaded}%` : "Press S to start", canvas.width / 2, canvas.height / 3);
    canvasContext.fillText(gameLoaded < 100 ? loadingAnimation : "", canvas.width / 2, canvas.height / 3 + 50);
    canvasContext.fillText("Controls", canvas.width / 2, canvas.height / 2 + 50);
    canvasContext.fillText("Left: A", canvas.width / 2, canvas.height / 2 + 100);
    canvasContext.fillText("Right: D", canvas.width / 2, canvas.height / 2 + 150);
    canvasContext.fillText("Shoot: W", canvas.width / 2, canvas.height / 2 + 200);

    if (loadingAnimation == ".") {
      loadingAnimation = ".."
      return
    }
    if (loadingAnimation == "..") {
      loadingAnimation = "..."
      return
    }
    if (loadingAnimation == "...") {
      loadingAnimation = "."
      return
    }
  }
  if (showHighscores) {
    canvasContext.fillStyle = "black"; /*black background*/
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "24px retro";
    canvasContext.fillStyle = "limegreen";
    canvasContext.textAlign = "center";
    canvasContext.fillText("Highscores", canvas.width / 2, 70);
    for (let i = 0; i < 8; i++) {
      canvasContext.textAlign = "left";
      canvasContext.fillText(i + 1 + " " + highscores[i].Player, 20, i * 50 + 140);
      canvasContext.textAlign = "right";
      canvasContext.fillText(highscores[i].Score, canvas.width - 20, i * 50 + 140);
    }

  }

}

function startGame(round) {
  clearInterval(intervalStartscreen);
  spaceshipAnimated = setInterval(spaceshipAnimation, 1000 / 120);
  playSound(spaceshipSound);
  spaceshipSound.play();
  setTimeout(cooldown, 2000);
  function cooldown() {
    clearInterval(spaceshipAnimated);
    gameMusic.play();
    playSound(gameMusic);
    resetGame();
    spaceshipY = 580;
    intervalGame = setInterval(callAll, 1000 / 140);
    intervalSnake = setInterval(
      round, 1000 / gameSpeed);
    intervalBackground = setInterval(moveBackground, 1000 / 30);
  }
}

function setScore() {

  if (score > highScore) {
    highScore = score;
    isHighscore = true;
  }
  multiplier = Math.floor(streak / 10) + 1 <= 3 ? Math.floor(streak / 10) + 1 : 3;
  canvasContext.textAlign = "start";
  canvasContext.font = "24px retro";
  canvasContext.fillStyle = "limegreen";
  canvasContext.fillText("Score", 12, 30);
  canvasContext.fillText("Hi-Score", 25 + canvas.width / 2, 30);
  canvasContext.fillStyle = "white";
  canvasContext.fillText(score, 12, 60);
  canvasContext.fillText(highScore, 25 + canvas.width / 2, 60);
}

function callAll() {
  drawEverything();
  moveShip();
  moveShipTouch();
  shoot();
  if (snakeRound) hitDetectionSnake()
  if (asteroidRound) hitDetectionShips();
  setScore();
  playSound(gameMusic);
  gameOver();
}

function drawEverything() {
  canvasContext.fillStyle = "black"; /*black background*/
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.drawImage(background, 0, backgroundScrollPosition);
  drawShipAndShot();
  if (snakeRound) { drawSnake() }
  else if (asteroidRound) { drawAsteroids() }
  else if (shipRound) { drawShipEnemies() }
}

function drawAsteroids() {
  canvasContext.textAlign = "center";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(`${enemyshipCount}/${enemyRequired}`, canvas.width / 2, canvas.height / 2 + 100);
  canvasContext.fillText(`${Math.floor(backgroundScrollPosition / 10) + 30}`, canvas.width / 2, canvas.height / 2 + 150);
  if (Math.floor(backgroundScrollPosition / 10) + 30 < 10) {
    alertSound.play()
  }
  moveAsteroids()
}

function moveAsteroids() {
  if (!asteroid.hit) {
    canvasContext.drawImage(asteroidImage, asteroid.x, asteroid.y, 40, 40);
    moveAsteroid(asteroid);
  }
  if (!asteroid2.hit) {
    canvasContext.drawImage(asteroidImage2, asteroid2.x, asteroid2.y, 40, 40);
    moveAsteroid(asteroid2);
  }
  if (!asteroid3.hit) {
    canvasContext.drawImage(asteroidImage3, asteroid3.x, asteroid3.y, 40, 40);
    moveAsteroid(asteroid3);
  }
  if (!asteroid4.hit) {
    canvasContext.drawImage(asteroidImage4, asteroid4.x, asteroid4.y, 40, 40);
    moveAsteroid(asteroid4);
  }
}
function drawShipAndShot() {
  if (multiplier <= 1) {
    canvasContext.fillStyle = "limegreen";
  }
  if (multiplier == 2) {
    canvasContext.fillStyle = "red";
  }
  if (multiplier == 3) {
    canvasContext.fillStyle = "blue";
  }
  canvasContext.drawImage(playerKilled ? explosion : spaceship, spaceshipX, spaceshipY - 60, 80, 100);
  canvasContext.fillRect(shotX, shotY, 10, 20);
  if (shotFired) {
    shotY -= 5;
  }
  if (shotY <= -20) {
    shotFired = false;
    streak = 0;
  }
  canvasContext.fillStyle = "limegreen";
}



function drawSnake() {
  canvasContext.filter = `hue-rotate(${color}deg)`;
  drawSnakeElement(1, snake.head.x, snake.head.y, snakeHead);
  drawSnakeElement(2, snake.body2.x, snake.body2.y, snakeBody);
  drawSnakeElement(3, snake.body3.x, snake.body3.y, snakeBody);
  drawSnakeElement(4, snake.body4.x, snake.body4.y, snakeBody);
  drawSnakeElement(5, snake.body5.x, snake.body5.y, snakeBody);
  drawSnakeElement(6, snake.body6.x, snake.body6.y, snakeBody);
  drawSnakeElement(7, snake.body7.x, snake.body7.y, snakeBody);
  drawSnakeElement(8, snake.body8.x, snake.body8.y, snakeBody);
  canvasContext.filter = "none";
}

function drawSnakeElement(lives, x, y, element) {
  if (snakeLives >= lives) {
    canvasContext.drawImage(score >= 1000 ? trumphead : element, x, y, 40, 40);
  }
  if (snakeLives == lives - 0.5) {
    canvasContext.drawImage(explosion, x, y, 40, 40);
  }
}

function moveBackground() {
  if (shipRound) {
    if (backgroundScrollPosition > -150) { backgroundScrollPosition -= 0.8 }
  } else backgroundScrollPosition -= 0.8
}

function moveShip() {
  if (aPressed) {
    spaceshipX -= 4;
    canonX -= 4;
  }
  if (spaceshipX < -20) {
    spaceshipX = -20;
    canonX = 20;
  }

  if (dPressed) {
    spaceshipX += 4;
    canonX += 4;
  }

  if (spaceshipX > 340) {
    spaceshipX = 340;
    canonX = 380;
  }
}

function moveShipTouch() {
  if (touchControls) {
    if (spaceshipX > touchX) {
      spaceshipX -= 4;
      canonX -= 4;
    }

    if (spaceshipX < touchX) {
      spaceshipX += 4;
      canonX += 4;
    }
  }
}

function changeTouchPosition(event) {
  touchControls = true;
  touchX = event.targetTouches ? event.targetTouches[0].pageX - canvas.offsetLeft : event.offsetX;
  if (!sPressed) {
    sPressed = true;
    score = 0;
    startGame(moveAsteroids);
  }
}

function keyDownHandler(event) {
  if (event.keyCode === 65 || event.keyCode === 37) {
    aPressed = true;
  }
  else if (event.keyCode === 68 || event.keyCode === 39) {
    dPressed = true;
  }
  else if (event.keyCode === 87 || event.keyCode === 38) {
    wPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.keyCode === 65 || event.keyCode === 37) {
    aPressed = false;
  }
  else if (event.keyCode === 68 || event.keyCode === 39) {
    dPressed = false;
  }
  else if (event.keyCode === 87 || event.keyCode === 38) {
    wPressed = false;
  }
}


function shoot() {
  if (wPressed && !shotFired) {
    shotFired = true;
    shotX = canonX - 5;
    shotY = canonY;
    if (multiplier <= 1) {
      playSound(laser);
      laser.play();
    }
    if (multiplier == 2) {
      playSound(laser2);
      laser2.play();
    }
    if (multiplier == 3) {
      playSound(laser3);
      laser3.play();
    }
  }

  if (touchControls && !shotFired) {
    window.navigator.vibrate(100);
    shotFired = true;
    shotX = canonX - 5;
    shotY = canonY;
    playSound(laser);
    laser.play();

  }
}

function moveElement(obj) {
  obj.x -= obj.speed;
  if (obj.x < -50 || obj.x > 400) {
    obj.y += 40;//50;
    obj.speed = obj.speed * (-1);
  }
}

function moveAsteroid(obj) {
  if (score < 400) {
    obj.y += 1.5;
  } else if (score < 800) {
    obj.y += 1.8
  } else if (score < 1200) {
    obj.y += 2.1;
  } else {
    obj.y += 2.4;
  }
  if (obj.y > canvas.height) {
    obj.y = -50;
  }
}


function moveSnake() {
  moveElement(snake.head);
  moveElement(snake.body2);
  moveElement(snake.body3);
  moveElement(snake.body4);
  moveElement(snake.body5);
  moveElement(snake.body6);
  moveElement(snake.body7);
  moveElement(snake.body8);
}

function hitDetection(obj) {
  if (shotY <= obj.y + 40 && shotY >= obj.y && shotX >= obj.x && shotX <= obj.x + 40 && snakeLives >= obj.lives) {
    hit = true;
  }
}

function hitDetectionShip(obj) {
  let shipHit
  if (shotY <= obj.y + 40 && shotY >= obj.y && shotX >= obj.x && shotX <= obj.x + 50 && obj.lives >= 1 && shotFired) {
    obj.lives -= 0.5
    hitSound.play()
    setTimeout(() => obj.lives -= 0.5, 100)
    shotFired = false
    shotY = 600
    shipHit = true
    score += 30
    streak += 1
  }
  if (obj.lives <= 0 && shipHit) {
    shipHit = false
  }
}

function hitDetectionSingle(obj) {
  if (spaceshipY < obj.y + 30 && spaceshipY + 100 > obj.y && spaceshipX + 10 < obj.x + 30 && spaceshipX + 80 > obj.x + 20) {
    displayGameoverScreen()
  }
  if (shotY <= obj.y + 50 && shotY >= obj.y && shotX >= obj.x - 10 && shotX <= obj.x + 50) {
    if (!obj.countBlocker) {
      playSound(hitSound);
      hitSound.pause();
      hitSound.currentTime = 0;
      hitSound.play();
      enemyshipCount += 1;
      score += 5 * multiplier;
      streak += 1;
      if (streak % 10 == 0) {
        playSound(powerup);
        powerup.play();
      }
    }
    obj.countBlocker = true;
    obj.image.src = "./images/explosion.png";
    shotFired = false;
    shotY = 600;
    setTimeout(() => {
      obj.hit = true;
      obj.countBlocker = false;
      obj.image.src = "./images/asteroid.png";
      obj.y = -(Math.random() * (350 - 20)) + 20;
      obj.x = (Math.random() * (350 - 20)) + 20;
    }, 100);
    setTimeout(() => obj.hit = false, 2000);

  }
  if (enemyshipCount == enemyRequired) {
    bonusScore = (Math.floor(backgroundScrollPosition / 10) + 30) * multiplier;
    score += bonusScore;
    enemyshipCount = 0;
    enemyRequired += 2;
    startNextRound(drawShipEnemies);
  }
}


function hitDetectionShips() {
  hitDetectionSingle(asteroid);
  hitDetectionSingle(asteroid2);
  hitDetectionSingle(asteroid3);
  hitDetectionSingle(asteroid4);
}

function hitDetectionSnake() {

  hit = false;

  hitDetection(snake.head);
  hitDetection(snake.body2);
  hitDetection(snake.body3);
  hitDetection(snake.body4);
  hitDetection(snake.body5);
  hitDetection(snake.body6);
  hitDetection(snake.body7);
  hitDetection(snake.body8);

  if (hit) {
    color += 50;
    shotFired = false;
    snakeLives -= 0.5;
    setTimeout(() => snakeLives -= 0.5, 100);
    score += 10 * multiplier;
    streak += 1;
    if (streak % 10 == 0) {
      playSound(powerup);
      powerup.play();
    }
    shotFired = false;
    shotY = 600;
    setTimeout(() => { color -= 50; }, 50);
    playSound(hitSound);
    hitSound.pause();
    hitSound.currentTime = 0;
    hitSound.play();
  }


  if (snakeLives == 0) {
    startNextRound(moveAsteroids);
  }


}

document.getElementById("highscore-form").onsubmit = function (event) {
  event.preventDefault();
  sPressed = false;
  document.getElementById("name-input").style.display = "none";
  intervalStartscreen = setInterval(displayStartscreen, 500);
  highscoresLoaded = false;
  let player = document.getElementById("name-input").value;
  if (player.length == 0) {
    player = "Player"
  }
  document.getElementById("name-input").value = "";
  const data = { Player: player, Score: score };
  fetch('https://highscore-db.herokuapp.com/post', {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    //mode: 'no-cors',
    //body: JSON.stringify({"Player": "Test","Score": 10})
    body: JSON.stringify(data)

  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

function gameOver() {

  if (asteroidRound && Math.floor(backgroundScrollPosition / 10) + 30 <= 0) {
    displayGameoverScreen()
  }
  if (snakeRound && snake.body2.y >= 450) {
    displayGameoverScreen()
  }
}

function displayGameoverScreen() {
  if (playerKilled) {
    window.navigator.vibrate(1000);
    snakeRound = false;
    shipRound = false;
    asteroidRound = true;
    clearInterval(intervalSnake);
    clearInterval(intervalGame);
    clearInterval(intervalBackground);
    backgroundScrollPosition = -300;
    enemyRequired = 6;
    gameMusic.playbackRate = 0.5;
    setTimeout(() => { gameMusic.pause(); gameMusic.currentTime = 0; gameMusic.playbackRate = 1 }, 1000);
    streak = 0;
    playSound(loseSound);
    loseSound.play();
    setTimeout(() => {
      canvasContext.fillStyle = "black";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      canvasContext.font = "24px retro";
      canvasContext.fillStyle = "limegreen";
      canvasContext.textAlign = "center";
      canvasContext.fillText("Game over", canvas.width / 2, canvas.height / 2 - 100);
      canvasContext.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 - 50);
      document.getElementById("name-input").style.display = "block";
      document.getElementById("name-input").focus()
      if (isHighscore) {
        canvasContext.fillText("New Highscore", 72, 200);
      }
      isHighscore = false;
      gameSpeed = 40;
    }, 2000)
  }
  playerKilled = true
}
function startNextRound(round) {
  if (snakeRound) {
    snakeRound = false
    asteroidRound = true
  } else if (asteroidRound) {
    asteroidRound = false
    shipRound = true
  } else if (shipRound) {
    shipRound = false
    snakeRound = true
  }
  clearInterval(intervalSnake);
  clearInterval(intervalGame);
  clearInterval(intervalBackground);
  spaceshipAnimated = setInterval(spaceshipAnimation, 1000 / 120);
  playSound(spaceshipSound);
  spaceshipSound.play();
  color += 20;
  gameSpeed += 3;
  canvasContext.font = "24px retro";
  canvasContext.fillStyle = "limegreen";
  canvasContext.fillText("Next round!", 100, canvas.height / 2);
  setTimeout(cooldown, 2000);
  function cooldown() {
    resetGame();
    clearInterval(spaceshipAnimated);
    spaceshipY = 580;
    intervalGame = setInterval(callAll, 1000 / 140);
    intervalSnake = setInterval(
      round, 1000 / gameSpeed);
    intervalBackground = setInterval(moveBackground, 1000 / 30);
  }
}

function spaceshipAnimation() {
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.drawImage(background, 0, backgroundScrollPosition);
  canvasContext.fillStyle = "limegreen";
  canvasContext.textAlign = "center";
  canvasContext.fillText(score == 0 ? "Save earth!" : "Next round!", canvas.width / 2, canvas.height / 2);
  canvasContext.fillText(bonusScore > 0 ? `Bonus Score: ${bonusScore}` : "", canvas.width / 2, canvas.height / 2 + 50);
  canvasContext.drawImage(spaceship, spaceshipX, spaceshipY - 60, 80, 100);
  spaceshipY -= 2.5;
  backgroundScrollPosition += 1.2;
}

function resetGame() {
  canvas;
  canvasContext;
  scale = 1;
  snake = {
    head: {
      x: 0,
      y: 0,
      speed: 10,
      lives: 1
    },
    body2: {
      x: 40,
      y: 0,
      speed: 10,
      lives: 2
    },
    body3: {
      x: 80,
      y: 0,
      speed: 10,
      lives: 3
    },
    body4: {
      x: 120,
      y: 0,
      speed: 10,
      lives: 4
    },
    body5: {
      x: 160,
      y: 0,
      speed: 10,
      lives: 5
    },
    body6: {
      x: 200,
      y: 0,
      speed: 10,
      lives: 6
    },
    body7: {
      x: 240,
      y: 0,
      speed: 10,
      lives: 7
    },
    body8: {
      x: 280,
      y: 0,
      speed: 10,
      lives: 8
    }
  };

  asteroid.y = -50;
  asteroid2.y = -100;
  asteroid3.y = -200;
  asteroid4.y = -300;
  spaceshipX = 150;
  canonY = 520;
  canonX = spaceshipX + 40;
  shotX = canonX - 5;
  shotY = canvas.height;
  playerKilled = false

  enemyShip1.lives = 2
  enemyShip2.lives = 2
  enemyShip1.shotY = enemyShip1.y
  enemyShip2.shotY = enemyShip2.y

  snakeX = 0;
  snakeX2 = 50;
  snakeX3 = 100;
  snakeX4 = 150;
  snakeX5 = 200;
  snakeX6 = 250;
  snakeX7 = 300;
  snakeX8 = 350;

  snakeY = 0;
  snakeY2 = 0;
  snakeY3 = 0;
  snakeY4 = 0;
  snakeY5 = 0;
  snakeY6 = 0;
  snakeY7 = 0;
  snakeY8 = 0;

  snakeSpeed = 10;
  snakeSpeed2 = 10;
  snakeSpeed3 = 10;
  snakeSpeed4 = 10;
  snakeSpeed5 = 10;
  snakeSpeed6 = 10;
  snakeSpeed7 = 10;
  snakeSpeed8 = 10;

  snakeLives = 8;
  aPressed = false;
  dPressed = false;
  wPressed = false;
  shotFired = false;

  backgroundScrollPosition = 0;

  enemyshipCount = 0;
  bonusScore = 0;
}


const burgerMenu = document.getElementById("burger-menu");
const hamburger = document.getElementById("hamburger");
let burgerMenuShowing = false;

function showMenu() {
  burgerMenuShowing = !burgerMenuShowing;
  if (burgerMenuShowing) {
    burgerMenu.style.height = "100vh";
    burgerMenu.style.opacity = "0.99";
    hamburger.style.position = "fixed";
  }
  else {
    burgerMenu.style.height = "0vh";
    burgerMenu.style.opacity = "0";
    hamburger.style.position = "absolute";
  }
}