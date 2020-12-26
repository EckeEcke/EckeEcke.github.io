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

function scrollToFooter(){
  footer.scrollIntoView({behavior: "smooth"});
}

function scrollToTiles(){
  blogTile.scrollIntoView({behavior: "smooth"});
}