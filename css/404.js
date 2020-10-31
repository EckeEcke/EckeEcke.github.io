setInterval(function(){
    let scrollY = document.body.scrollTop;
    turnEmoji(scrollY/10);
    ;}, 1);

  function turnEmoji(scrollPOS){
    let content = document.getElementById("scroll-content");
 
    content.style.fontSize = `${scrollPOS}em)`;
  }