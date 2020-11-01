const buttonClearList = document.querySelector('.empty-cart');



buttonClearList.addEventListener('click', function () {
const ol = document.querySelector('.cart__items');
ol.innerText = '';
});


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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(product) {
  const endpoint = `https://api.mercadolibre.com/items/${product}`;
  const cart = document.querySelector('.cart__items');
  fetch(endpoint)
  .then(response => response.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    cart.appendChild(createCartItemElement({ sku, name, salePrice }));
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButton.addEventListener('click', function (event) {
    const product = event.target.parentNode;
    getSkuFromProductItem(product);
    addToCart(getSkuFromProductItem(product));
  });
  section.appendChild(addButton);
  return section;
}

function fetchProdutcs() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((element) => {
        const { id: sku, thumbnail: image, title: name } = element;
        const items = document.querySelector('.items');
        items.appendChild(createProductItemElement({ sku, name, image }));
      });
    });
}

window.onload = function onload() {
  fetchProdutcs();
};
