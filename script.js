/* variables to change status of span-elements */
var wholeText1 = "false";
var wholeText2 = "false";
var wholeText3 = "false";


/* the functions are activated via onclick-event, the span-element is getting displayed */
/* and the var "wholeText" gets true as whole text is displayed, also changes button-text to "fold up" */

function readMore1() {
  if (wholeText1 == "false"){
    document.getElementById("spanCol1").style.display ="block";
    wholeText1 = "true";
    document.getElementById("button1").textContent = "Fold up";
  }


/* if "wholeText is true sets everything back to default" */

  else{
    document.getElementById("spanCol1").style.display ="none";
    wholeText1 = "false";
    document.getElementById("button1").textContent = "Read more";
  }
}

function readMore2() {
  if (wholeText2 == "false"){
    document.getElementById("spanCol2").style.display ="block";
    wholeText2 = "true";
    document.getElementById("button2").textContent = "Fold up";
  }

  else{
    document.getElementById("spanCol2").style.display ="none";
    wholeText2 = "false";
    document.getElementById("button2").textContent = "Read more";
  }
}

function readMore3() {
  if (wholeText3 == "false"){
    document.getElementById("spanCol3").style.display ="block";
    wholeText3 = "true";
    document.getElementById("button3").textContent = "Fold up";
  }

  else{
    document.getElementById("spanCol3").style.display ="none";
    wholeText3 = "false";
    document.getElementById("button3").textContent = "Read more";
  }
}

function closeBanner() {
    document.getElementById("privacy-banner").style.display ="none";
    }
