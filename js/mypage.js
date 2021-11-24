const burgerMenu = document.getElementById("burger-menu");
let showBurgermenu = false;
let backdrop = document.getElementById("backdrop");

function toggleBurgermenu(){
  showBurgermenu = !showBurgermenu;
  if (showBurgermenu) {
    burgerMenu.style.transform = "translateX(0)";
    backdrop.style.display = "block"
    document.body.style.overflowY = "hidden"
    document.body.style.height = "100%"
  }
  else {
    burgerMenu.style.transform = "translateX(100%)";
    backdrop.style.display = "none"
    document.body.style.overflowY = "auto"
    document.body.style.height = "auto"
  }
}

const items = document.querySelectorAll('.appear');

const active = function(entries){
    entries.forEach(entry => {
        if(entry.isIntersecting){
        entry.target.classList.add('inview'); 
        }else{
            entry.target.classList.remove('inview'); 
        }
    });
}

const io = new IntersectionObserver(active);
 for(let i=0; i < items.length; i++){
    io.observe(items[i]);
 }



const footer = document.getElementById("footer");
const aboutTile = document.getElementById("about-tile");
const body = document.getElementById("body");
const scrollTopBTN = document.getElementById("scroll-back-top-BTN");



function scrollToFooter(){
  footer.scrollIntoView({behavior: "smooth"});
}

function scrollToAbout(){
  aboutTile.scrollIntoView({behavior: "smooth"});
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

let marioLeft = -60;

function movingBox(){
  marioBox.style.left = marioLeft + "px";
  if(marioLeft<window.innerWidth){
    marioLeft += 2;
  }

  if(marioLeft>=window.innerWidth){
    marioLeft = -500;
  }
}

setInterval(movingBox, 1000/60);

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