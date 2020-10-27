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

async function getItemApiById(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  return fetch(endpoint)
  .then(r => r.json())
  .then(item => {
    document.querySelector('.cart__items').appendChild(createCartItemElement(item));
  });
}

function addToCartClickListener() {
  document.querySelectorAll('.item__add').forEach( item => {
    item.addEventListener('click', (event => {
      getItemApiById(event.target.parentNode.firstChild.innerText);
    }));
  });
}

function showOnScreen(array) {
  const items = document.querySelector('.items');
  array.forEach(product => items.appendChild(createProductItemElement(product)));
  addToCartClickListener();
}

async function getAPI() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(r => r.json())
  .then(item => showOnScreen(item.results));
}

function cartItemClickListener(event) {
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  getAPI();
};
