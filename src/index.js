// Є Discovery API (https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2)
// API_KEY = 'uHSLi07StIOlriMPxJGxUbSYsHDs6AFx';
// Потрібно відрендерити колекцію  івентів і реалізувати пагінацію
// за допомогою бібліотеки tui - pagination(https://www.npmjs.com/package/tui-pagination)
// запит робимо використовуючи fetch().
// https://www.npmjs.com/package/tui-pagination


import { pagination } from './pagination';

const API_KEY = 'uHSLi07StIOlriMPxJGxUbSYsHDs6AFx';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/';
const list = document.querySelector('.gallery');
const page = pagination.getCurrentPage();
const form = document.querySelector('.form');
let query = '';

const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');

form.addEventListener('submit', onFormSearch)

function onFormSearch(evt) {
    evt.preventDefault();
    console.log(evt);
    query = evt.target.elements.input.value;

    renderFirstPage(page, query);
}

list.addEventListener('click', onItemClick)

function onItemClick(evt) {
    const id = evt.target.id;
    console.log(id);
    backdrop.classList.remove('is-hidden');
    createModalMarkup(id)
}

backdrop.addEventListener('click', onCloseModal)

function onCloseModal() {
    backdrop.classList.add('is-hidden')
}

function fetchDataId(id) {
  return fetch(`${BASE_URL}events.json?apikey=${API_KEY}&id=${id}`)
    .then(res => {
      // console.log(res);
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .catch(rej => {
      console.log(rej);
    });
}

function createModalMarkup(id) {
    fetchDataId()
        .then((data) => {
            console.log(data);
            const markup = `<img src="${data._embedded.events[0].images[0].url}"
             alt="${data._embedded.events[0].name}">
             <p>${data._embedded.events[0].name}</p>`

            modal.innerHTML = markup;
    })
}

function fetchData(page, query) {
  return fetch(`${BASE_URL}events.json?apikey=${API_KEY}&page=${page}&keyword=${query}`)
    .then(res => {
      // console.log(res);
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .catch(rej => {
      console.log(rej);
    });
}

function renderFirstPage(page, query) {
  fetchData(page, query)
    .then(data => {
      pagination.reset(data.page.totalElements);
      createMarkup(data._embedded.events);
    })
    .catch(err => {
      console.log(err);
    });
}
renderFirstPage(page, query);

function createMarkup(arr) {
  const markup = arr
    .map(
        ({ name, id }) =>
            `<li id="${id}"><p id="${id}">${name}</p></li>`
    ).join('');
  list.innerHTML = markup;
}
function renderEvt(page, query) {
  fetchData(page, query)
    .then(data => {
      createMarkup(data._embedded.events);
    })
    .catch(err => {
      console.log(err);
    });
}
pagination.on('afterMove', (event) => {
  const currentPage = event.page;
  renderEvt(currentPage, query)
  console.log(currentPage);
});

