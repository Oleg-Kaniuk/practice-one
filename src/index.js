// Є Discovery API (https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2)
// API_KEY = 'uHSLi07StIOlriMPxJGxUbSYsHDs6AFx';
// Потрібно відрендерити колекцію  івентів і реалізувати пагінацію
// за допомогою бібліотеки tui - pagination(https://www.npmjs.com/package/tui-pagination)
// запит робимо використовуючи fetch().
// https://www.npmjs.com/package/tui-pagination


import { pagination } from './pagination';  // Імпортуємо функцію pagination з іншого файлу

const API_KEY = 'uHSLi07StIOlriMPxJGxUbSYsHDs6AFx';  // API-ключ для доступу до Ticketmaster API
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/';  // Базова URL-адреса API
const list = document.querySelector('.gallery');  // Вибираємо DOM-елемент з класом '.gallery'
const page = pagination.getCurrentPage();  // Отримуємо поточну сторінку з об'єкту pagination
const form = document.querySelector('.form');  // Вибираємо форму пошуку за класом '.form'
let query = '';  // Змінна для зберігання пошукового запиту

const backdrop = document.querySelector('.backdrop');  // Вибираємо DOM-елемент з класом '.backdrop'
const modal = document.querySelector('.modal');  // Вибираємо DOM-елемент з класом '.modal'

form.addEventListener('submit', onFormSearch);  // Додаємо обробник події 'submit' до форми пошуку

function onFormSearch(evt) {
    evt.preventDefault();  // Перешкоджаємо стандартній поведінці форми
    console.log(evt);  // Виводимо об'єкт події у консоль
    query = evt.target.elements.input.value;  // Отримуємо значення поля вводу і зберігаємо в змінну 'query'

    renderFirstPage(page, query);  // Викликаємо функцію для відображення першої сторінки з результатами пошуку
}

list.addEventListener('click', onItemClick);  // Додаємо обробник події 'click' до списку з результатами

function onItemClick(evt) {
    const id = evt.target.id;  // Отримуємо ідентифікатор (id) елементу, на який натиснули
    console.log(id);  // Виводимо ідентифікатор у консоль
    backdrop.classList.remove('is-hidden');  // Видаляємо клас 'is-hidden' з елементу '.backdrop'
    createModalMarkup(id);  // Викликаємо функцію для створення вмісту модального вікна
}

backdrop.addEventListener('click', onCloseModal);  // Додаємо обробник події 'click' до елементу '.backdrop'

function onCloseModal() {
    backdrop.classList.add('is-hidden');  // Додаємо клас 'is-hidden' до елементу '.backdrop', приховуючи його
}

function fetchDataId(id) {
  return fetch(`${BASE_URL}events.json?apikey=${API_KEY}&id=${id}`)
    .then(res => {
      // console.log(res);
      if (!res.ok) {
        throw new Error();  // Викидаємо помилку, якщо відповідь сервера не "ок"
      }
      return res.json();  // Повертаємо відповідь сервера у форматі JSON
    })
    .catch(rej => {
      console.log(rej);  // Виводимо помилку у консоль
    });
}

function createModalMarkup(id) {
    fetchDataId(id)
        .then((data) => {
            console.log(data);  // Виводимо отримані дані у консоль
          const markup = `<img src="${data._embedded.events[0].images[0].url}" 
          alt="${data._embedded.events[0].name}">
          <p>${data._embedded.events[0].name}</p>`;  // Створюємо розмітку для модального вікна

        modal.innerHTML = markup;  // Вставляємо створену розмітку в модальне вікно
    });
}

function fetchData(page, query) {
  return fetch(`${BASE_URL}events.json?apikey=${API_KEY}&page=${page}&keyword=${query}`)
    .then(res => {
      // console.log(res);
      if (!res.ok) {
        throw new Error();  // Викидаємо помилку, якщо відповідь сервера не "ок"
      }
      return res.json();  // Повертаємо відповідь сервера у форматі JSON
    })
    .catch(rej => {
      console.log(rej);  // Виводимо помилку у консоль
    });
}

renderFirstPage(page, query);  // Викликаємо функцію для відображення першої сторінки з результатами пошуку

function renderFirstPage(page, query) {
  fetchData(page, query)
    .then(data => {
      pagination.reset(data.page.totalElements);  // Скидаємо параметри пагінації із загальною кількістю елементів
      createMarkup(data._embedded.events);  // Викликаємо функцію для створення розмітки зі списком подій
    })
    .catch(err => {
      console.log(err);  // Виводимо помилку у консоль
    });
}

function createMarkup(arr) {
  const markup = arr
    .map(
        ({ name, id }) =>
            `<li id="${id}"><p id="${id}">${name}</p></li>`
    ).join('');  // Створюємо розмітку для списку подій
  list.innerHTML = markup;  // Вставляємо створену розмітку у список
}

function renderEvt(page, query) {
  fetchData(page, query)
    .then(data => {
      createMarkup(data._embedded.events);  // Викликаємо функцію для створення розмітки зі списком подій
    })
    .catch(err => {
      console.log(err);  // Виводимо помилку у консоль
    });
}

pagination.on('afterMove', (event) => {
  const currentPage = event.page;  // Отримуємо номер поточної сторінки з об'єкту події
  renderEvt(currentPage, query);  // Викликаємо функцію для відображення списку подій на новій сторінці
  console.log(currentPage);  // Виводимо номер поточної сторінки у консоль
});
