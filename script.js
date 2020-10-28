function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.id = id;
  }
  return e;
}

function cartLocalStorage() {
  const lista = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('carrinho', lista);
}

function cartItemClickListener(event) {
  event.target.remove();
  cartLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addListElement(item) {
  document.querySelector('.cart__items')
    .appendChild(createCartItemElement(item));
  cartLocalStorage();
}

function idButtonEvent() {
  fetch(`https://api.mercadolibre.com/items/${event.target.id}`)
    .then(response => response.json())
      .then((object) => {
        addListElement(object);
      });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku))
    .addEventListener('click', idButtonEvent);

  return section;
}


function addItemList(item) {
  const listItem = document.querySelector('.items');
  listItem.appendChild(createProductItemElement(item));
}

function getItemsShopping() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador&limit=10')
    .then(response => response.json())
      .then(({ results }) => {
        results.forEach((item) => {
          addItemList(item);
        });
      });
}
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
function loadCartStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('carrinho');
  const items = document.querySelectorAll('.cart__item');
  items.forEach(item => item.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  getItemsShopping();
  loadCartStorage();
};
