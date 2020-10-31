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
          console.log(mouthOpened);
  }

  if (mouthOpened == false) {
    pacman.innerHTML = `<image src="images/pacman_closed.png" class="pac-image"></image>`;
  }

  mouthOpened = !mouthOpened;
}

function movePacman(){
  pacMoves += 0.5;
  console.log(pacMoves);
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
