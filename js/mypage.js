const burgerMenu = document.getElementById("burger-menu");

function showMenu(){
  if (burgerMenu.style.height === "0vh") {
    burgerMenu.style.height = "100vh";
    burgerMenu.style.opacity = "0.99";
    burgerMenu.style.zIndex = "2500";
    burgerMenu.style.position = "fixed";
  }
  else {
    burgerMenu.style.height = "0vh";
    burgerMenu.style.opacity = "0";
    burgerMenu.style.zIndex = "-3000";
    burgerMenu.style.position = "absolute";
  }
}



const footer = document.getElementById("footer");
const blogTile = document.getElementById("blog-tile");
const body = document.getElementById("body");
const scrollTopBTN = document.getElementById("scroll-back-top-BTN");



function scrollToFooter(){
  footer.scrollIntoView({behavior: "smooth"});
}

function scrollToTiles(){
  blogTile.scrollIntoView({behavior: "smooth"});
}

function scrollToTop(){
  body.scrollIntoView({behavior: "smooth"});
}

document.addEventListener("scroll", function(){
  if(scrollY>400){
    scrollTopBTN.style.display = "block";
  } else {
    scrollTopBTN.style.display = "none";
  }
})


const marioBox = document.getElementById("homepage-running-mario");

let marioLeft = -30;

function movingBox(){
  marioBox.style.left = marioLeft + "%";

  if(marioLeft<160){
    marioLeft += 0.25;
  }

  if(marioLeft>=160){
    marioLeft = -60;
  }
}

setInterval(movingBox, window.innerWidth/48);

const homepageMario = document.getElementById("homepage-mario");

let spritesheetPosition = 0;
let sheetMovement = 50;

function animateMario(){
  spritesheetPosition += sheetMovement;
  homepageMario.style.right = -spritesheetPosition + "px";

  if(spritesheetPosition == 100){
    sheetMovement = -50;
  }

  if(spritesheetPosition == 0){
    sheetMovement = 50;
  }
}

setInterval(animateMario, 102);


function itsMeMario(){
  document.getElementById("mario-sound").volume = 0.2;
  document.getElementById("mario-sound").play();
}