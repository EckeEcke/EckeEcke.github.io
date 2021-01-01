function showMenu(){
  if (document.getElementById("burger-menu").style.height === "0vh") {
    document.getElementById("burger-menu").style.height = "100vh";
    document.getElementById("burger-menu").style.opacity = "0.99";
    document.getElementById("hamburger").style.position = "fixed";
  }
  else {
    document.getElementById("burger-menu").style.height = "0vh";
    document.getElementById("burger-menu").style.opacity = "0";
    document.getElementById("hamburger").style.position = "absolute";
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