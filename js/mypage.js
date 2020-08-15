function closeBanner(){
  document.getElementById('cookies').style.display="none";
}

function showMenu(){
  if (document.getElementById("burger-menu").style.display === "none") {
    document.getElementById("burger-menu").style.display = "block";
  }
  else {
    document.getElementById("burger-menu").style.display = "none";
  }
}
