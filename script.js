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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function productAPI(itemId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const data = await response.json();
  const cartItems = document.querySelector('.cart__items');
  return cartItems.appendChild(createCartItemElement(data));
}

function addProductToCart(event) {
  const getItemId = event.target.parentNode.firstChild.innerText;
  return productAPI(getItemId);
}

function setButtonEvent() {
  const allButtons = document.querySelectorAll('.item__add');
  allButtons.forEach(button => button.addEventListener('click', addProductToCart));
}

function loadProducts(products) {
  const items = document.querySelector('.items');
  products.forEach((product) => {
    items.appendChild(createProductItemElement(product));
  });
}

async function productsAPI() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  return loadProducts(data.results);
}

window.onload = async function onload() {
  await productsAPI();
  await setButtonEvent();
};
