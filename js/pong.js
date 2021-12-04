window.addEventListener("keydown", function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
  }
}, false);

window.addEventListener("gamepad1Connected", function(e) {
  
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});

window.addEventListener("gamepad2Connected", function(e) {
  gamepad2Connected = true

  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
  e.gamepad.index, e.gamepad.id,
  e.gamepad.buttons.length, e.gamepad.axes.length);
});
  



const canvas = document.getElementById("game-canvas");
const startBtn = document.getElementById("start-button");
const soundBtn = document.getElementById("sound-button");
const descriptionTxt = document.getElementById("description");

const colorInputP1 = document.getElementById("color-picker-p1");
const colorInputP2 = document.getElementById("color-picker-p2");
const gameSpeedInput = document.getElementById("game-speed");

const onePlayerBTN = document.getElementById("1player-mode");
const twoPlayerBTN = document.getElementById("2player-mode");

const soundCheer1 = document.getElementById("cheer1");
const soundCheer2 = document.getElementById("cheer2");
const soundVictory = document.getElementById("victory");
const inputs = document.getElementById("game-settings");
const bounce = document.getElementById("bounce");
const bounceWall = document.getElementById("bounceWall");

let colorPaddle1 = "#ed3d0d";
let colorPaddle2 = "#26ed17";

let runGame;

let gamepad2Connected = false

let canvasContext;
let ballX = 395;
let ballSpeedX = 5;
let ballDirectionX = 1;
let ballY = 300;
let ballSpeedY = 0;
let paddle1Y = 250;
let paddle1X = 30;
let paddle2Y = 250;
let paddle2X = 760;
let upPressed = false;
let downPressed = false;
let leftPressed = false
let rightPressed = false
let wPressed = false;
let sPressed = false;
let dPressed = false;
let aPressed = false

let padUpPressed = false
let padDownPressed = false
let padLeftPressed = false
let padRightPressed = false

let gameStarted = false

let collisionP1 = false
let collisionP2 = false
let Score1 = 0;
let Score2 = 0;
const paddleHeight = 100;
const tolerance = 20;
const sounds = document.getElementsByTagName("audio");
let gameRuns = false;
let gameSpeed = 100;

let touchControls = false;
let touchY;


sounds.muted = false;

colorInputP1.addEventListener("change", function () {
  colorPaddle1 = colorInputP1.value;
});

colorInputP2.addEventListener("change", function () {
  colorPaddle2 = colorInputP2.value;
});

gameSpeedInput.addEventListener("change", function () {
  gameSpeed = gameSpeedInput.value;
})

canvas.addEventListener("touchstart", changeTouchPosition, false);
canvas.addEventListener("touchmove", changeTouchPosition, false);

window.onload = function () {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  if(navigator.getGamepads()[0] !== null){
    console.log("gamepad connected")
  }
  console.log(navigator.getGamepads()[0])
}



function startGame() {
  gameStarted = true
  canvas.style.display = "block";
  canvasContext = canvas.getContext("2d");
  if (onePlayerBTN.checked) {
    runGame = setInterval(onePlayerMode, 1000 / gameSpeed)
  } else {
    runGame = setInterval(twoPlayerMode, 1000 / gameSpeed)
  }
  startBtn.style.display = "none";
  descriptionTxt.style.display = "none";
  inputs.style.display = "none";

}

function drawScore() {
  canvasContext.font = "48px retro";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(Score1, canvas.width / 4 - 20, 60);
  canvasContext.font = "48px retro";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(Score2, 3 * canvas.width / 4, 60);
}

function soundControl() {
  if (sounds.muted == true) {
    sounds.muted = false;
    soundBtn.innerHTML = "&#128266;";
  } else {
    sounds.muted = true;
    soundBtn.innerHTML = "&#128263;";
  }
}

function twoPlayerMode() {
  drawEverything();
  moveEverything();
  collision(paddle2X, paddle2Y, upPressed, downPressed, collisionP2, 1);
  collision(paddle1X, paddle1Y, wPressed, sPressed, collisionP1, 0);
  move1();
  move2();
  setScore();
  drawScore();
}

function onePlayerMode() {
  drawEverything();
  moveEverything();
  collision(paddle2X, paddle2Y, upPressed, downPressed, collisionP2, 1);
  collision(paddle1X, paddle1Y, wPressed, sPressed, collisionP1, 0);
  move1();
  move1Touch();
  setScore();
  drawScore();
  moveAI();
}


function moveEverything() {
  ballX = ballX + ballSpeedX * ballDirectionX;
  ballY = ballY + ballSpeedY;

  if (ballX >= canvas.width || ballX <= 0) {
    ballDirectionX = ballDirectionX * -1;
  }

  ballY = ballY + ballSpeedY;
  if (ballY >= canvas.height) {
    ballSpeedY = -ballSpeedY;
    playSound(bounceWall)
    ballY = canvas.height;
  }

  if (ballY <= 0) {
    ballSpeedY = -ballSpeedY;
    playSound(bounceWall)
    ballY = 0;
  }

}



function move1(event) {
  let gamepad1Connected = false
  if (navigator.getGamepads()[0] !== null) {
    gamepad1Connected = true
  }
  if (wPressed) {
    paddle1Y -= 8;
  }
  if (gamepad1Connected && navigator.getGamepads()[0].buttons[12].pressed) {
    paddle1Y -= 8
  }
  if (paddle1Y < 0) {
    paddle1Y = 0;
  }
  if (sPressed) {
    paddle1Y += 6;
  }
  if (gamepad1Connected && navigator.getGamepads()[0].buttons[13].pressed) {
    paddle1Y += 6
  }
  if (paddle1Y > 500) {
    paddle1Y = 500;
  }
  if (dPressed && paddle1X < canvas.width /2.5) {
    paddle1X += 5
  }
  if (gamepad1Connected && navigator.getGamepads()[0].buttons[15].pressed && paddle1X < canvas.width /2.5) {
    paddle1X += 5
  }
  if (aPressed && paddle1X > 20) {
    paddle1X -= 5
  }
  if (gamepad1Connected && navigator.getGamepads()[0].buttons[14].pressed && paddle1X > 20) {
    paddle1X -= 5
  }
}

function move1Touch() {
  if (touchControls) {
    if (touchY > paddle1Y) {
      paddle1Y += 10;
    }

    if (touchY < paddle1Y) {
      paddle1Y -= 10;
    }
  }
}

function move1Gamepad() {
  if (padUpPressed) {
    paddle1Y -= 8;
  }
  if (paddle1Y < 0) {
    paddle1Y = 0;
  }
  if (padDownPressed) {
    paddle1Y += 6;
  }
  if (paddle1Y > 500) {
    paddle1Y = 500;
  }
  if (padRightPressed && paddle1X < canvas.width /2.5) {
    paddle1X += 5
  }
  if (padLeftPressed && paddle1X > 20) {
    paddle1X -= 5
  }
}

function changeTouchPosition(event) {
        touchControls = true;
        touchY = event.targetTouches ? event.targetTouches[0].pageY - canvas.offsetTop : event.offsetY;
        console.log(touchY);
    }


function move2(event) {
  if (downPressed) {
    paddle2Y = paddle2Y + 8;
  }
  if (paddle2Y > 500) {
    paddle2Y = 500;
  }
  if (upPressed) {
    paddle2Y = paddle2Y - 6;
  }
  if (paddle2Y < 0) {
    paddle2Y = 0;
  }
  if (rightPressed && paddle2X < canvas.width - 20) {
    paddle2X += 5
  }
  if (leftPressed && paddle2X > canvas.width - canvas.width /2.5) {
    paddle2X -= 5
  }

}


function moveAI() {
  if (ballSpeedX > 0) {
    moveAItoBall();
  }
  if (paddle2Y < 0) {
    paddle2Y = 0;
  }
  if (paddle2Y > 500) {
    paddle2Y = 500;
  }
}

function moveAItoBall() {
  downPressed = false
  upPressed = false
  if (ballY > paddle2Y + 50) {
    paddle2Y += 4;
    downPressed;
  }

  if (ballY < paddle2Y + 50) {
    paddle2Y -= 4;
    upPressed;
  }
}

function resetAfterScore() {
  ballX = 395;
  ballY = 300;
  paddle1Y = 250
  paddle1X = 30
  paddle2Y = 250
  paddle2X = 760
  ballSpeedY = 0;
  let p1Scored = ballDirectionX < 0
  ballDirectionX = 0
  setTimeout(() => {
    ballDirectionX = p1Scored ? 1 : -1
    ballSpeedX = 5
  }, 1000)
}


function keyDownHandler(event) {
  if (event.keyCode === 87) {
    wPressed = true;
  }
  else if (event.keyCode === 65) {
    aPressed = true
  }
  else if (event.keyCode === 68) {
    dPressed = true
  }
  else if (event.keyCode === 83) {
    sPressed = true;
  }
  else if (event.keyCode === 38) {
    upPressed = true;
  }
  else if (event.keyCode === 40) {
    downPressed = true;
  }
  else if (event.keyCode === 37) {
    leftPressed = true;
  }
  else if (event.keyCode === 39) {
    rightPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.keyCode === 87) {
    wPressed = false;
  }
  else if (event.keyCode === 65) {
    aPressed = false
  }
  else if (event.keyCode === 68) {
    dPressed = false
  }
  else if (event.keyCode === 83) {
    sPressed = false;
  }
  else if (event.keyCode === 38) {
    upPressed = false;
  }
  else if (event.keyCode === 40) {
    downPressed = false;
  }
  else if (event.keyCode === 37) {
    leftPressed = false;
  }
  else if (event.keyCode === 39) {
    rightPressed = false;
  }
}


function drawVictoryMessage(message1, message2) {
  canvasContext.font = "48px retro";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(message1, 120, 350);
  canvasContext.font = "48px retro";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(message2, 130 + canvas.width / 2, 350);
}

function playSound(sound){
  if (!sounds.muted) {
    sound.play()
  }
}



function setScore() {
  let scored = false;
  if (ballX >= canvas.width) {
    Score1 = Score1 + 1;
    playSound(soundCheer1)
    scored = true;
  }

  if (ballX <= 0) {
    Score2 = Score2 + 1;
    playSound(soundCheer2);
    scored = true;
  }

  if (Score1 >= 7) {
    if (sounds.muted == false) {
      soundVictory.play();
    }

    clearInterval(runGame);
    drawVictoryMessage("Win!", "Lose");
    setTimeout(() => window.location.reload(), 5000);
  } else if (Score2 >= 7) {
    if (sounds.muted == false) {
      soundVictory.play();
    }

    clearInterval(runGame)
    drawVictoryMessage("Lose", "Win!");
    setTimeout(() => window.location.reload(), 5000);
  } else if (scored && Score1 < 7 && Score2 < 7) {
    resetAfterScore();
    scored = false;
  }
}



function collision(paddleX, paddleY, upBTN, downBTN, collisionDetected, gamepadIndex) {
  let gamepadConnected = navigator.getGamepads()[gamepadIndex] !== null
  if (ballX > paddleX - 5  && ballX < paddleX + 15 && ballY >= paddleY - tolerance && ballY < paddleY - 1 + paddleHeight + tolerance && !collisionDetected) {
    if (ballX > canvas.width / 2){
      collisionP2 = true
      collisionP1 = false
    } else {
      collisionP1 = true
      collisionP2 = false
      
    }
    ballDirectionX = -ballDirectionX;
    if (collisionP1) {
      ballX += dPressed ? 5 : 0
      ballSpeedX = dPressed ? 10 : 5
      if (gamepadConnected) {
        ballX += navigator.getGamepads()[gamepadIndex].buttons[15].pressed ? 5 : 0
        ballSpeedX = navigator.getGamepads()[gamepadIndex].buttons[15].pressed ? 10 : 5
      }
    }
    if (collisionP2) {
      ballX -= leftPressed ? 5 : 0
      ballSpeedX = leftPressed ? 10 : 5
    }
    if (ballSpeedY == 0) {
      ballSpeedY = 2;
    }
    if (downBTN && ballSpeedY < 0) {
      ballSpeedY -= 1;
    }
    if (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[13].pressed && ballSpeedY < 0){
      ballSpeedY -= 1
    }
    if (upBTN && ballSpeedY > 0) {
      ballSpeedY += 1;
    }
    if (gamepadConnected && navigator.getGamepads()[gamepadIndex].buttons[12].pressed && ballSpeedY > 0){
      ballSpeedY += 1
    }
    playSound(bounce)
  }

}


function drawEverything() {

  canvasContext.fillStyle = "black"; /*black background*/
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = "red"; /*middle line*/
  canvasContext.fillRect(canvas.width / 2, 0, 1, canvas.height);
  canvasContext.fillStyle = "white"; /*ball*/
  canvasContext.fillRect(ballX, ballY, 10, 10);
  canvasContext.fillStyle = colorPaddle1;/*Paddle1*/
  canvasContext.fillRect(paddle1X, paddle1Y, 10, paddleHeight);
  canvasContext.fillStyle = colorPaddle2; /*Paddle2*/
  canvasContext.fillRect(paddle2X, paddle2Y, 10, paddleHeight);
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