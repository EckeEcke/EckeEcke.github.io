let catFact = document.getElementById("cat-fact");
let factButton = document.getElementById("new-fact-button");

function getFact(){
  fetch("https://catfact.ninja/fact?max_length=65")
    .then(response => response.json())
    .then(json => catFact.innerHTML = json.fact);
};

getFact();

factButton.addEventListener("click", getFact);




const clock = document.getElementById("clock");

function getTime(){

  const now = new Date();
  let seconds = now.getSeconds();
  let minutes = now.getMinutes();
  let hours = now.getHours();

  if (seconds == 0){
    clock.style.color="rgb(255, 1, 33)";
  } else{
    clock.style.color="rgb(34, 252, 40)";
  }


  if (seconds < 10){
    seconds = "0" + seconds;
  }

  if (minutes < 10){
    minutes = "0" + minutes;
  }

  if (hours < 10){
    hours = "0" + hours;
  }

  clock.innerHTML =
    hours + ":" + minutes + ":" + seconds;
}


setInterval(getTime, 1000);




const pacman = document.getElementById("pacman");
const pallet1 = document.getElementById("pallet-1");
const pallet2 = document.getElementById("pallet-2");
const pallet3 = document.getElementById("pallet-3");
const pallet4 = document.getElementById("pallet-4");
const pallet5 = document.getElementById("pallet-5");
const pallet6 = document.getElementById("pallet-6");
const pallet7 = document.getElementById("pallet-7");

let mouthOpened = true;
let pacMoves = 0;

let pacPosition = "-10px";
let pacSteps = "20px";


function drawPacman(){
  if (mouthOpened == true){
    pacman.innerHTML = `<image src="images/pacman_opened.png" class="pac-image"></image>`;
  }

  if (mouthOpened == false) {
    pacman.innerHTML = `<image src="images/pacman_closed.png" class="pac-image"></image>`;
  }

  mouthOpened = !mouthOpened;
}

function movePacman(){
  pacMoves += 0.5;
  pacPosition = parseInt(pacPosition, 10) + parseInt(pacSteps, 10) + "px";
  pacman.style.left = pacPosition;
  if (pacMoves == 9){
    pacMoves = 0;
    pacPosition = "-10px";
  }
}



function drawPallets(pallet, palletNumber, steps){
  if (palletNumber<=steps){
    pallet.innerHTML = "";
  } else{
    pallet.innerHTML = `<image src="images/pallet.png"></image>`;
  }
}

function pacAnimation(){
drawPacman();
drawPallets(pallet1, 1, pacMoves);
drawPallets(pallet2, 2, pacMoves);
drawPallets(pallet3, 3, pacMoves);
drawPallets(pallet4, 4, pacMoves);
drawPallets(pallet5, 5, pacMoves);
drawPallets(pallet6, 6, pacMoves);
drawPallets(pallet7, 7, pacMoves);
movePacman();
};

setInterval(pacAnimation, 300);



const randomGame = document.getElementById("random-game");
const reactionBtn1 = document.getElementById("firstBTN");
const reactionBtn2 = document.getElementById("secondBTN");
const reactionBtn3 = document.getElementById("thirdBTN");
const reactionBtn4 = document.getElementById("fourthBTN");
const reactionBtn5 = document.getElementById("fifthBTN");
const reactionBtn6 = document.getElementById("sixthBTN");
const startBTN = document.getElementById("start-button");
const scoreBoard = document.getElementById("scoreboard");
const textbox = document.getElementById("random-text");
const reactionDescription = document.getElementById("reaction-description");

let turns = 0;
let randomNumber = 0;
let lastNumber = 0;
let points = 0;
let randomGameInterval;
let gameSpeed = 1000;

startBTN.addEventListener("click", function(){
  randomGame.style.display = "block";
  startBTN.style.display = "none";
  textbox.style.display = "none";
  reactionDescription.style.display = "none";
  randomGameInterval = setInterval(startReactionGame, gameSpeed)});

reactionBtn1.addEventListener("click", function(){
  countHit(reactionBtn1)});

reactionBtn2.addEventListener("click", function(){
  countHit(reactionBtn2)});

reactionBtn3.addEventListener("click", function(){
  countHit(reactionBtn3)});

reactionBtn4.addEventListener("click", function(){
  countHit(reactionBtn4)});

reactionBtn5.addEventListener("click", function(){
  countHit(reactionBtn5)});

reactionBtn6.addEventListener("click", function(){
  countHit(reactionBtn6)});


function changeColorOfBTN(someNumber, someBTN, btnNumber){
  if (someNumber == btnNumber){
    someBTN.disabled = false;
    someBTN.style.backgroundColor = "limegreen";

  } else {
    someBTN.disabled = true;
    someBTN.style.backgroundColor = "darkgrey";
  }
}

function countHit(someBTN){
    points += 1;
    someBTN.disabled = true;
    someBTN.style.backgroundColor = "darkgrey";
}

function startReactionGame(){

scoreBoard.innerHTML = `Points: ${points}`;

while (randomNumber === lastNumber){
randomNumber = Math.floor(Math.random() * 6) + 1;
}
lastNumber = randomNumber;

changeColorOfBTN(randomNumber, reactionBtn1, 1);
changeColorOfBTN(randomNumber, reactionBtn2, 2);
changeColorOfBTN(randomNumber, reactionBtn3, 3);
changeColorOfBTN(randomNumber, reactionBtn4, 4);
changeColorOfBTN(randomNumber, reactionBtn5, 5);
changeColorOfBTN(randomNumber, reactionBtn6, 6);

turns += 1;
console.log(turns);
endGame();
}

function endGame(){
if (turns === 20){
clearInterval(randomGameInterval);
randomGame.style.display = "none";
startBTN.style.display = "block";
startBTN.innerHTML = "Play again?";
textbox.style.display = "block";
textbox.innerHTML = `Wow! You reached ${points} points! Next round will be harder!`;
gameSpeed -= 100;
turns = 0;
points = 0;
}
}
