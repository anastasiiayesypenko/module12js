'use strict'

let urlList = getUrlFromLocalStorage();

let form = document.querySelector('.url-form');
let input = document.querySelector('.url-form__input');
let addUrlButton = document.querySelector('.url-form__button');
let cardSection = document.querySelector('.favorites-wrapper');
drawFavorites()
console.log(urlList);

function drawFavorites() {
  let template = document.querySelector('#favorites-template').innerHTML.trim();
  let compileTemplate = Handlebars.compile(template);
  let cardMarkup = urlList.reduce((acc, elem) => acc + compileTemplate(elem), '');
  cardSection.insertAdjacentHTML('afterbegin', cardMarkup);
}



form.addEventListener('submit', onUrlAdding);
cardSection.addEventListener('click', onDeleteClick);

function onUrlAdding(event) {
  event.preventDefault();
  let urlValidation = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  if (urlValidation.test(input.value) && !urlList.find(elem => elem.url === input.value)) {
    cardSection.innerHTML = '';
    urlList.unshift({url: input.value});
    setUrlToLocalStorage(urlList);
    drawFavorites();
  } else if (urlList.find(elem => elem.url === input.value)) {
    alert("Такая закладка уже существует!");
  } else if (!urlValidation.test(input.value)) {
    alert("Не прошло валидацию!")
  }
  form.reset();
};

function onDeleteClick(event) {
  if (event.target.nodeName === "BUTTON") {
    let cardForDelete = event.target.parentNode;
    let cardForDeleteUrl = cardForDelete.querySelector('.favorites-card__url').textContent;
    let indexOfDeletedUrl = urlList.indexOf(urlList.find(el => el.url === cardForDeleteUrl));
    cardForDelete.remove();
    urlList.splice([indexOfDeletedUrl], 1);
    setUrlToLocalStorage(urlList);
  }
}

function setUrlToLocalStorage(array) {
  localStorage.setItem('favourites-links', JSON.stringify(array));
}
function getUrlFromLocalStorage() {
  let data = localStorage.getItem('favourites-links');
  return data ? JSON.parse(data) : [];
}

