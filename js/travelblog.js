const form = document.getElementById("input-form");
const countryInput = document.getElementById("country-input");
const cityInput = document.getElementById("city-input");
const purposeInput = document.getElementById("purpose-input");
const blogEntries = document.getElementById("blog-entries");
const imageInput = document.getElementById("image-input");
const timeInput = document.getElementById("travel-time");



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

  blogEntry.innerHTML =
  `
  <h4>${entry.city}, ${entry.country} (${entry.travelTime})</h4>
  <div class="in-border"
  <p>${entry.purpose}</p>
  <img class="blog-image" src="${entry.image}">
  </div>
  <br>
  <button class="delete-button" onclick="deleteEntry(event)">❌</button>
  `;


  blogEntries.appendChild(blogEntry);
}



function deleteEntry(index){
  let entries = getEntries();
  console.log(entries);
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
  singleEntry = {city, country, travelTime, purpose, image};
  let entries = getEntries();
  entries.push(singleEntry);
  stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);
}
