'use strict';

var urlList = getUrlFromLocalStorage();
var form = document.querySelector('.url-form');
var input = document.querySelector('.url-form__input');
var addUrlButton = document.querySelector('.url-form__button');
var cardSection = document.querySelector('.favorites-wrapper');
drawFavorites();
console.log(urlList);

function drawFavorites() {
  var template = document.querySelector('#favorites-template').innerHTML.trim();
  var compileTemplate = Handlebars.compile(template);
  var cardMarkup = urlList.reduce(function (acc, elem) {
    return acc + compileTemplate(elem);
  }, '');
  cardSection.insertAdjacentHTML('afterbegin', cardMarkup);
}

form.addEventListener('submit', onUrlAdding);
cardSection.addEventListener('click', onDeleteClick);

function onUrlAdding(event) {
  event.preventDefault();
  var urlValidation = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  if (urlValidation.test(input.value) && !urlList.find(function (elem) {
    return elem.url === input.value;
  })) {
    cardSection.innerHTML = '';
    urlList.unshift({
      url: input.value
    });
    setUrlToLocalStorage(urlList);
    drawFavorites();
  } else if (urlList.find(function (elem) {
    return elem.url === input.value;
  })) {
    alert("Такая закладка уже существует!");
  } else if (!urlValidation.test(input.value)) {
    alert("Не прошло валидацию!");
  }

  form.reset();
}

;

function onDeleteClick(event) {
  if (event.target.nodeName === "BUTTON") {
    var cardForDelete = event.target.parentNode;
    var cardForDeleteUrl = cardForDelete.querySelector('.favorites-card__url').textContent;
    var indexOfDeletedUrl = urlList.indexOf(urlList.find(function (el) {
      return el.url === cardForDeleteUrl;
    }));
    cardForDelete.remove();
    urlList.splice([indexOfDeletedUrl], 1);
    setUrlToLocalStorage(urlList);
  }
}

function setUrlToLocalStorage(array) {
  localStorage.setItem('favourites-links', JSON.stringify(array));
}

function getUrlFromLocalStorage() {
  var data = localStorage.getItem('favourites-links');
  return data ? JSON.parse(data) : [];
}