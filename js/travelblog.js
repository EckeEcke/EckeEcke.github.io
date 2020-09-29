const form = document.getElementById("input-form");
const countryInput = document.getElementById("country-input");
const cityInput = document.getElementById("city-input");
const purposeInput = document.getElementById("purpose-input");
const blogEntries = document.getElementById("blog-entries");
const imageInput = document.getElementById("image-input");
const timeInput = document.getElementById("travel-time");
const apiKey = "18ebb74c4c845cd84cc98885effee0ae";



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



function createEntry(entry){
  let blogEntry = document.createElement("article");
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${entry.city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      let temp = "Temperature: " +data.main.temp + "°C";
      let feelsLike = "Feels like: " + data.main.feels_like  + "°C";
      let weatherDescription = data.weather[0].description;
      let icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      blogEntry.innerHTML =
      `
      <h4>${entry.city}, ${entry.country}
      <br>
      ${entry.travelTime}</h4>
      <p>${entry.purpose}</p>
      <img class="blog-image" src="${entry.image}">
      <br><br>
      <span>
      ${temp}
      <br>
      ${feelsLike}
      <br>
      <img src="${icon}">

      ${weatherDescription}
      </span>
      <br>
      ${entry.btn}
      `;
      })


  blogEntries.appendChild(blogEntry);
}



function deleteEntry(){
  let entries = getEntries();
  console.log(entries);
  entries.splice(0, 1);
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
  let btn = `<button class=delete-button onclick=deleteEntry(event)>❌</button>`;
  singleEntry = {city, country, travelTime, purpose, image, btn};
  let entries = getEntries();
  entries.push(singleEntry);
  stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);
}
