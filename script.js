// ------ CONST SETUP -------
const cartKey = 'cartListLS';
const itemQuery = 'computador';
// --------------------------

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function itemObjectCreate(keys, item) {
  const itemObj = {};
  keys.forEach((key) => { itemObj[key] = item[key]; });
  return itemObj;
}

function cartLocalStorage() {
  const cartItems = document.getElementsByClassName('cart__item');
  const cartItemsArray = Array.from(cartItems);
  const itemsToSave = cartItemsArray.reduce((acc, item, index) => (
    {
      ...acc,
      [index]: item.innerHTML,
    }
  ), {});
  localStorage.setItem(cartKey, JSON.stringify(itemsToSave));
}

/*
function cartItemClickListener(event) {
  return new Promise((resolve, reject) => {
    event.srcElement.remove();
    resolve(cartLocalStorage());
  })
}
*/

function cartItemClickListener(event) {
  event.srcElement.remove();
  cartLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fectchItem = endpoint => (
  new Promise((resolve) => {
    fetch(endpoint)
      .then(response => response.json()
        .then((item) => {
          document.querySelector('.cart__items')
          .appendChild(
            createCartItemElement(
              itemObjectCreate(['id', 'title', 'price'], item)));
          resolve(cartLocalStorage());
        }));
  })
);

function handlerEventClick(event) {
  if (event.target.className === 'item__add') {
    const itemId = getSkuFromProductItem(event.path[1]);
    const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
    fectchItem(endpoint);
  }
  if (event.target.className === 'empty-cart') {
    document.querySelector('.cart__items').innerHTML = '';
  }
}

function fectchItemSearch(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach(item =>
        document.querySelector('.items').appendChild(
          createProductItemElement(itemObjectCreate(['id', 'title', 'thumbnail'], item))));
    });
}

function loadLocalStorage() {
  if (localStorage.getItem(cartKey) === null) {
    localStorage.setItem(cartKey, {});
  } else {
    const savedItens = JSON.parse(localStorage.getItem(cartKey));
    (Object.values(savedItens)).forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `${item}`;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('.cart__items').appendChild(li);
    });
  }
}

window.onload = function onload() {
  fectchItemSearch(itemQuery);
  loadLocalStorage();
  document.onclick = handlerEventClick;
};
