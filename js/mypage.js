function closeBanner(){
  document.getElementById('cookies').style.display="none";
}

function showMenu(){
  const hamburgerElement = document.getElementById("hamburger");
  if (hamburgerElement.classList.contains("hamburger-open")) {
    hamburgerElement.classList.remove("hamburger-open")
  }
  else {
    hamburgerElement.classList.add("hamburger-open")
  }
}
