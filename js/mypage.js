function showMenu(){
  if (document.getElementById("burger-menu").style.display === "none") {
    document.getElementById("burger-menu").style.display = "block";
  }
  else {
    document.getElementById("burger-menu").style.display = "none";
  }
}


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
