function showMenu(){
  if (document.getElementById("burger-menu").style.display === "none") {
    document.getElementById("burger-menu").style.display = "block";
  }
  else {
    document.getElementById("burger-menu").style.display = "none";
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