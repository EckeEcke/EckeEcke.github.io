const form = document.getElementById("input-form");
const countryInput = document.getElementById("country-input");
const cityInput = document.getElementById("city-input");
const purposeInput = document.getElementById("purpose-input");
const blogEntries = document.getElementById("blog-entries");
const imageInput = document.getElementById("image-input");
const timeInput = document.getElementById("travel-time");
const apiKey = "18ebb74c4c845cd84cc98885effee0ae";

const planeButton = document.getElementById("✈️");
const trainButton = document.getElementById("🚄");
const carButton = document.getElementById("🚗");
const busButton = document.getElementById("🚌");
const shipButton = document.getElementById("🚢");

const emoji1Button = document.getElementById("😍");
const emoji2Button = document.getElementById("😃");
const emoji3Button = document.getElementById("🙂");
const emoji4Button = document.getElementById("😒");
const emoji5Button = document.getElementById("😡");



let transport = "";
let mood = "";



form.addEventListener("submit", onFormSubmit);

window.onload = function(){
  getEntries();
  putInHTML();
}


function onFormSubmit(event){
  blogEntries.innerHTML = "";
  event.preventDefault();
  saveEntries();
  getEntries();
  putInHTML();
  form.reset();
}




function putInHTML(){
  let entries = getEntries();

  entries.forEach(createEntry);

}



function createEntry(entry, index){
  let blogEntry = document.createElement("article");
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${entry.city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      let temp = "Temperature: " +data.main.temp + "°C";
      let feelsLike = "Feels like: " + data.main.feels_like  + "°C";
      let weatherDescription = data.weather[0].description;
      let icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      let button = document.createElement("button");

      blogEntry.innerHTML =
      `
      <h3>${entry.city}, ${entry.country}
      <br>
      ${entry.travelTime}</h3>

      <img class="blog-image" src="${entry.image}">
      <br><br>
      <p>${entry.purpose}</p>
      <hr class="blog-line">
      <p>Transport: ${entry.transport}&nbsp; &nbsp;
      Mood: ${entry.mood}</p>
      <span>
      ${temp}
      <br>
      ${feelsLike}
      <br>
      ${weatherDescription}
      <br>
      <img class="weather-icon" src="${icon}">
      <br>
      </span>
      <br>
      `;

      button.innerHTML = "❌";
      button.classList.add("delete-button");
      console.log(button)
      blogEntry.appendChild(button);
      button.addEventListener("click", function() {
        console.log(index);
        deleteEntry(index);
        putInHTML();
      })
      })


  blogEntries.appendChild(blogEntry);
}



function deleteEntry(index){
  let entries = getEntries();
  entries.splice(index, 1);
  stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);
  deleteFromHTML(event);
}



function deleteFromHTML(event){
  let element = event.target;
  let parent = element.parentElement;
  blogEntries.removeChild(parent);
}



function getEntries(){
  let entries = localStorage.getItem("entries");

  if (entries === null){
    return [];
  }

  let parsedEntries = JSON.parse(entries);
  return parsedEntries;
}



function saveEntries(singleEntry){
  let country = countryInput.value;
  let city = cityInput.value;
  let purpose = purposeInput.value;
  let image = imageInput.value;
  if (image === ""){
    image = "images/blog-placeholder.jpg";
  }
  let travelTime = timeInput.value;
  checkRadio();
  singleEntry = {city, country, travelTime, purpose, image, mood, transport};
  let entries = getEntries();
  entries.push(singleEntry);
  stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);
}


function checkRadio() {

    if (planeButton.checked){
      transport = "✈️";
    }
    if (trainButton.checked){
      transport = "🚄";
    }
    if (carButton.checked){
      transport ="🚗";
    }
    if (busButton.checked){
      transport= "🚌";
    }
    if (shipButton.checked){
      transport ="🚢";
    }


    if (emoji1Button.checked){
      mood = "😍";
    }
    if (emoji2Button.checked){
      mood = "😃";
    }
    if (emoji3Button.checked){
      mood ="🙂";
    }
    if (emoji4Button.checked){
      mood = "😒";
    }
    if (emoji5Button.checked){
      mood ="😡";
    }

    return mood;
    return transport;

  }
