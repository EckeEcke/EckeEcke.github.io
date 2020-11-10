function showMenu(){
  if (document.getElementById("burger-menu").style.display === "none") {
    document.getElementById("burger-menu").style.display = "block";
  }
  else {
    document.getElementById("burger-menu").style.display = "none";
  }
}





const optionA = document.getElementById("option-a");
const optionB = document.getElementById("option-b");
const inputA = document.getElementById("input-option-a");
const inputB = document.getElementById("input-option-b");
const voteBTN = document.getElementById("submit-vote")
const form = document.getElementById("results-input");
const drawBTN = document.getElementById("draw");

let votesA = 0;
let votesB = 0;
let sumVotes = 0;
let a = 0;
let b = 0;
let IntervalA;
let intervalB;


voteBTN.addEventListener("click", sendAndReceiveVotes);


function sendAndReceiveVotes(){

event.preventDefault();
let vote;

if (inputA.checked){
  vote = "a";
}
if (inputB.checked){
  vote = "b";
}

const proxyURL = "https://cors-anywhere.herokuapp.com/";
const url = `https://simple-vote-app.herokuapp.com/votes?vote=${vote}`;
  console.log(vote);
fetch(proxyURL+url)
  .then(response => response.json())
  .then(data => {
    votesA = data.votesA;
    votesB = data.votesB;
    sumVotes = data.votesTotal;
  })
  .then(function(){
    showvotesA();
    showvotesB();
    console.log("drawing");
  })};

function showvotesA(){
  let percentageA = Math.round(votesA*100/sumVotes);
  intervalA = setInterval(function(){
    if (a<percentageA){
      a += 1;
      optionA.style.top = 100 - a + "px";
    }
    if (a > percentageA){
      a -= 1;
      optionA.style.top = 100 - a + "px";
      console.log("a=" + a);
    }
    if (a == percentageA){
      stopvotesA();
    }
    }, 1000/60);
    

}

function showvotesB(){
  let percentageB = Math.round(votesB*100/sumVotes);
  intervalB = setInterval(function(){
    if (b<percentageB){
      b += 1;
      optionB.style.top = 100 - b + "px";
    }
    if (b > percentageB){
      b -= 1;
      optionB.style.top = 100 - b + "px";
    }
    
    if (b == percentageB){
      stopvotesB();
    }
    }, 1000/60);
    
    
}

function stopvotesA(){
    clearInterval(intervalA);
}

function stopvotesB(){
    clearInterval(intervalB);
  }






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


const kong = document.getElementById("donkey");
    let dkLeft = 0;



    function moveDK(){
        dkLeft -= 202;
        if (dkLeft <= -606){
          dkLeft = -2;
        }
        kong.style.left = dkLeft + "px";
    }

    setInterval(moveDK, 250);


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



let secretWord = document.getElementById("secret-word");
const formGuess = document.getElementById("guessed-word");
const playField = document.getElementById("put-words-here");
const hint = document.getElementById("hint");
const triesLeft = document.getElementById("tries-left");
let submitGuess;
let lives = 5;
let secretLetters = [];
let randomNumberHM;


const randomAnimals = [
  {"name": "MOUSE", "hint": "I like cheese"},
  {"name": "GOOSE", "hint": "some might call me a duck"},
  {"name": "HORSE", "hint": "Take me for a ride"},
  {"name": "SNAKE", "hint": "I might me a strangler"},
  {"name": "TIGER", "hint": "ROAR!"},
  {"name": "WHALE", "hint": "big, really big, blubb"},
  {"name": "RHINO", "hint": "I´m a pretty unicorn <3"},
  {"name": "SNAIL", "hint": "I have all the time in the world"},
  {"name": "MOLES", "hint": "We like to dig tunnels"},
  {"name": "PANDA", "hint": "Bamboo <3"},
  {"name": "KOALA", "hint": "meet me down under"},
  {"name": "SHARK", "hint": "I make no friends at beach"}

];


const randomButton = document.getElementById("random-button");
const guessButton = document.getElementById("guess-button");


formGuess.addEventListener("submit", userGuess);
randomButton.addEventListener("click", randomName);



function userGuess(event){
  event.preventDefault();
  console.log(secretLetters)
  console.log(secretWord);
  lives = lives - 1;
  triesLeft.innerHTML = `Tries: ${lives}`;
  console.log(lives);
  if (secretLetters[0] == document.getElementById("guessed-letter-1").value){
    document.getElementById("guessed-letter-1").value = secretLetters[0];
  }
  else{
    document.getElementById("guessed-letter-1").value = "";
  }
  if (secretLetters[1] == document.getElementById("guessed-letter-2").value){
    document.getElementById("guessed-letter-2").value = secretLetters[1];
  }
  else{
    document.getElementById("guessed-letter-2").value = "";
  }
  if (secretLetters[2] == document.getElementById("guessed-letter-3").value){
    document.getElementById("guessed-letter-3").value = secretLetters[2];
  }
  else{
    document.getElementById("guessed-letter-3").value = "";
  }
  if (secretLetters[3] == document.getElementById("guessed-letter-4").value){
    document.getElementById("guessed-letter-4").value = secretLetters[3];
  }
  else{
    document.getElementById("guessed-letter-4").value = "";
  }
  if (secretLetters[4] == document.getElementById("guessed-letter-5").value){
    document.getElementById("guessed-letter-5").value = secretLetters[4];
  }
  else{
    document.getElementById("guessed-letter-5").value = "";
  }
  if (lives >= 0 && secretLetters[0] == document.getElementById("guessed-letter-1").value
      && secretLetters[1] == document.getElementById("guessed-letter-2").value
      && secretLetters[2] == document.getElementById("guessed-letter-3").value
      && secretLetters[3] == document.getElementById("guessed-letter-4").value
      && secretLetters[4] == document.getElementById("guessed-letter-5").value){
        alert("You win");
        window.location.reload();
      }
   else if (lives == 0){
    alert(`You lose! The correct answer was "${randomAnimals[randomNumberHM].name}"`);
    window.location.reload();
  }


}

function randomName(){
randomNumberHM = random(0,randomAnimals.length-1);
secretWord = randomAnimals[randomNumberHM].name;
hint.innerHTML = randomAnimals[randomNumberHM].hint;
secretLetters = secretWord.split("");
randomButton.style.display = "none";
guessButton.style.display = "block";
return secretLetters;
}

function random(min, max) {
  x = Math.floor(Math.random() * (max +1 -min)) + min;
  return x;
}




const mario = document.getElementById("mario");
    let marioLeft = 0;

    const marioBackground = document.getElementById("mario-background");
    let backgroundLeft = -400;

    function moveMario(){
        marioLeft -= 202;
        if (marioLeft <= -606){
          marioLeft = -2;
        }
        mario.style.left = marioLeft + "px";
    }

    function moveBackground(){
      backgroundLeft += 1;
      if (backgroundLeft >= -10){
        backgroundLeft = -400;
      }
      marioBackground.style.left = backgroundLeft + "px";
    }

    setInterval(moveMario, 100);
    setInterval(moveBackground, 10);






    const jumpButton = document.getElementById("jump-button");
   const jumpingBox = document.getElementById("jumping-box");
   const jumpman = document.getElementById("jumping-mario");
   const questionBlock = document.getElementById("question-block");
   const coinSound = document.getElementById("coin");

   let jumpingBoxPosition = 0;
   let jumpDirection = 12;


   let jumpAnimation;

   function makeTheJump(){
     jumpAnimation = setInterval(jump, 50);
   }

   function jump(){
     jumpButton.disabled = true;
     jumpman.style.left = "-50px";
     if(jumpingBoxPosition >= 30){
       jumpman.style.left = "-100px";
     }
     if (jumpDirection == 3){
       questionBlock.style.top = "-2px";
       coinSound.play();
     }

     if (jumpDirection == -3){
       questionBlock.style.top = "7px";
     }
     if (jumpingBoxPosition == 0 && jumpDirection < 0){
       clearInterval(jumpAnimation);
       jumpDirection = 12;
       jumpman.style.left = "0px";
       jumpButton.disabled = false;
     }
     jumpingBox.style.bottom = jumpingBoxPosition + "px";
     jumpDirection -= 1;
     jumpingBoxPosition += jumpDirection;
     }
