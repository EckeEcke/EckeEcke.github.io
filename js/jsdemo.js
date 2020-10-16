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
