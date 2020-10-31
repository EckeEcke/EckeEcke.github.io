setInterval(function(){
    let scrollY = document.body.scrollTop;
    turnEmoji(scrollY/40);
    ;}, 1);

  function turnEmoji(scrollPOS){
    let content = document.getElementById("scroll-content");
    //content.style.transform = `rotate(${scrollPOS}deg)`;
    content.style.fontSize = `${scrollPOS}em`;
  }