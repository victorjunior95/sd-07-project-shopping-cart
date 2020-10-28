// node_modules/.bin/cypress run

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

function cartItemClickListener(event) {
  event.target.remove(); // https://www.w3schools.com/jsref/met_element_remove.asp
}


function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText; // retorna o id do produto
}

function showItemCart(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
  .then(response => response.json())
  .then(object => document.querySelector('ol').appendChild(createCartItemElement(object)));
}

function clickButton() {
  const selectedItems = document.querySelectorAll('button');
  selectedItems.forEach(item => item.addEventListener('click', () => {
    showItemCart(getSkuFromProductItem(item.parentElement));
  }));
}

function showProductList(array) {
  const items = Object.entries(array);
  items.forEach(entry => document.querySelector('.items').appendChild(createProductItemElement(entry[1])));
}

function productList() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then(object => showProductList(object.results))
    .then(object => clickButton(object));
}

window.onload = function onload() {
  productList();
};
