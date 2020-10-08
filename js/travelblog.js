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


const editBtn = document.getElementById("edit-button");
const editableCity = document.getElementsByClassName("city");
const editableCountry = document.getElementsByClassName("country");
const editableTime = document.getElementsByClassName("time");
const editablePurpose = document.getElementsByClassName("purpose");
const images = document.getElementsByClassName("image");
const imageLinks = document.getElementsByClassName("image-link");



let transport = "";
let mood = "";


window.onload = function(){
  putInHTML();
};

form.addEventListener("submit", onFormSubmit);





function onFormSubmit(event){
  blogEntries.innerHTML = "";
  event.preventDefault();
  saveEntries();
  getEntries();
  putInHTML();
  form.reset();
};




function putInHTML(){
  const entries = getEntries();
  console.log(entries);
  entries.forEach(createEntry);

};



function createEntry(entry, index){
  const blogEntry = document.createElement("article");
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${entry.city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const temp = "Temperature: " +data.main.temp + "°C";
      const feelsLike = "Feels like: " + data.main.feels_like  + "°C";
      const weatherDescription = data.weather[0].description;
      const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const deleteButton = document.createElement("button");
      const editButton = document.createElement("button");
      const saveButton = document.createElement("button");
      const editEmoji = "🖍️";

      blogEntry.innerHTML =
        `
        <h3><span class="city edit" contentEditable="false">${entry.city}</span>, <span class="country edit" contentEditable="false">${entry.country}</span>
        <br>
        <span class="time edit" contentEditable="false">${entry.travelTime}</span></h3>

        <img class="blog-image" src="${entry.image}">

        <span class="image-link" style="display: none;">Enter new image link: <br><span class="image edit" contentEditable>${entry.image}</span></span>

        <br><br>
        <p class="purpose edit" contentEditable="false">${entry.purpose}</p>

        <hr class="blog-line">

        <p>Transport: <span class="transport">${entry.transport}</span>&nbsp; &nbsp;
        Mood: <span class="mood">${entry.mood}</span></p>

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

      console.log(blogEntry);
      deleteButton.innerHTML = "🗑️";
      deleteButton.classList.add("delete-button");
      blogEntry.appendChild(deleteButton);
      deleteButton.addEventListener("click", function() {
        deleteEntry(index);
        putInHTML();
      });

      editButton.innerHTML = `<span class="edit-icon">${editEmoji} </span>`;
      editButton.classList.add("edit-button");
      blogEntry.appendChild(editButton);

      editButton.addEventListener("click", function(){
          // Boolean("false") === true; Boolean("true") === false;
          // true.toString() === "true"; false.toString() === "false"
          const negateBooleanString = (booleanString) => (!Boolean(booleanString)).toString()
          editableCity[index].contentEditable = negateBooleanString(editableCity[index].contentEditable)
          editableCountry[index].contentEditable = negateBooleanString(editableCountry[index].contentEditable)
          editableTime[index].contentEditable = negateBooleanString(editableTime[index].contentEditable)
          editablePurpose[index].contentEditable = negateBooleanString(editablePurpose[index].contentEditable)

          if(imageLinks[index].style.display === "none"){
             imageLinks[index].style.display = "block";
           }else{
             imageLinks[index].style.display = "none";
           };
        });

        saveButton.innerHTML = `💾`;
        saveButton.classList.add("edit-save-button");
        blogEntry.appendChild(saveButton);
        saveButton.addEventListener("click", function(){
          const mood = entry.mood;
          const transport = entry.transport;
          const country = editableCountry[index].textContent;
          const city = editableCity[index].textContent;
          const purpose = editablePurpose[index].textContent;
          let image = images[index].textContent;
          if (image === ""){
            image = "images/blog-placeholder.jpg";
          }
          const travelTime = editableTime[index].textContent;
          const singleEntry = {city, country, travelTime, purpose, image, mood, transport};
          const entries = getEntries();
          entries.splice(index, 1, singleEntry);
          stringifiedEntries = JSON.stringify(entries);
          localStorage.setItem("entries", stringifiedEntries);

          editableCity[index].contentEditable = "false";
          editableCountry[index].contentEditable = "false";
          editableTime[index].contentEditable = "false";
          editablePurpose[index].contentEditable = "false";
          imageLinks[index].style.display = "none";
          location.reload();
        });


      blogEntries.appendChild(blogEntry);
});
};



function deleteEntry(index){
  const entries = getEntries();
  entries.splice(index, 1);
  stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);
  deleteFromHTML(event);
}



function deleteFromHTML(event){
  const element = event.target;
  const parent = element.parentElement;
  blogEntries.removeChild(parent);
}



function getEntries(){
  const entries = localStorage.getItem("entries");

  if (entries === null){
    return [];
  }

  const parsedEntries = JSON.parse(entries);
  return parsedEntries;
}



function saveEntries(singleEntry){
  const country = countryInput.value;
  const city = cityInput.value;
  const purpose = purposeInput.value;
  let image = imageInput.value;
  if (image === ""){
    image = "images/blog-placeholder.jpg";
  }
  const travelTime = timeInput.value;
  checkRadio();
  singleEntry = {city, country, travelTime, purpose, image, mood, transport};
  const entries = getEntries();
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

function saveEdits(index){
  console.log(index);
  const country = editableCountry[index].textContent;
  const city = editableCity[index].textContent;
  const purpose = editablePurpose[index].textContent;
  let image = images[index].textContent;
  console.log(index);
  if (image === ""){
    image = "images/blog-placeholder.jpg";
  }
  const travelTime = editableTime[index].textContent;
  const singleEntry = {city, country, travelTime, purpose, image, mood, transport};
  console.log(singleEntry);
  const entries = getEntries();
  entries.splice(index, 1, singleEntry);
  console.log(entries);
  stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);
}
