function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(itemID) {
  localStorage.removeItem(itemID);
  document.getElementById(itemID).remove();
}

// ID Generator from https://gist.github.com/gordonbrander/2230317

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return `_${Math.random().toString(36).substr(2, 9)}`;
};

function createCartItemElement({ id, title, price, idEntry }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  if (idEntry) li.id = idEntry;
  else li.id = ID();
  li.sku = id;
  li.title = title;
  li.price = price;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', () => cartItemClickListener(li.id));
  return li;
}

function addInList(item) {
  localStorage.setItem(item.id, JSON.stringify([item.sku, item.title, item.price]));
  document.getElementsByClassName('cart__items')[0].appendChild(item);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  buttonItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonItem.addEventListener('click', () => fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then(data => addInList(createCartItemElement(data))));
  section.appendChild(buttonItem);
  return section;
}

/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}*/

function createElementFromAPI(itens) {
  itens.forEach((item) => {
    const newItem = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    const itemCreated = createProductItemElement(newItem);
    document.getElementsByClassName('items')[0].appendChild(itemCreated);
  });
}

function getStorage(storage) {
  const keys = Object.keys(storage);
  for (let index = 0; index < keys.length; index += 1) {
    const values = JSON.parse(storage.getItem(keys[index]));
    const obj = {
      id: values[0],
      title: values[1],
      price: values[2],
      idEntry: keys[index],
    };
    document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(obj));
  }
}

function createClearButton() {
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    const keys = Object.keys(localStorage);
    for (let index = 0; index < keys.length; index += 1) {
      cartItemClickListener(keys[index]);
    }
  });
}

window.onload = function onload() {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const myObject = { method: 'GET' };
  fetch(API_URL, myObject)
    .then(response => response.json())
    .then(data => createElementFromAPI(data.results));
  getStorage(localStorage);
  createClearButton();
};
