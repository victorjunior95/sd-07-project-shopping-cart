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

function createProductItemElement({ sku, name, image }) {
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

function saveItensCartInLocalStorage() {
  const listItensCart = document.querySelector('.cart__items');
  localStorage.setItem('itensCart', listItensCart.outerHTML);
}

function cartItemClickListener(event) {
  const olCart = event.target.parentNode;
  olCart.removeChild(this);
  saveItensCartInLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const itensCart = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  itensCart.appendChild(li);
  saveItensCartInLocalStorage();
  return li;
}

const productInCart = (product) => {
  const { id: sku, title: name, price: salePrice } = product;
  const itemsCart = document.querySelector('.cart__items');
  const item = createCartItemElement({ sku, name, salePrice });
  itemsCart.appendChild(item);
  saveItensCartInLocalStorage();
};

const insertProductInCar = (event) => {
  const itemSelected = event.target.parentNode;

  const endpoint = `https://api.mercadolibre.com/items/${getSkuFromProductItem(itemSelected)}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      productInCart(object);
    });
};

const productButtonsToAddToCart = (buttons) => {
  buttons.forEach((item) => {
    item.addEventListener('click', insertProductInCar);
  });
};

const products = (product) => {
  const productsKeys = Object.keys(product);
  const sectionItems = document.querySelector('.items');

  productsKeys.forEach((key) => {
    const { id: sku, title: name, thumbnail: image } = product[key];
    const item = createProductItemElement({ sku, name, image });
    sectionItems.appendChild(item);
  });
  const buttons = document.querySelectorAll('.item__add');
  productButtonsToAddToCart(buttons);
};

const fetchItens = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      products(object.results);
    });
};

function clear() {
  const buttonClearCart = document.querySelector('.empty-cart');
  buttonClearCart.addEventListener('click', () => {
    const listProductsInCart = document.querySelector('.cart__items');
    listProductsInCart.innerHTML = '';
    saveItensCartInLocalStorage();
  });
}

function loadingItensCartOfLocalStorage() {
  const itensCart = document.querySelector('.cart__items');
  const cart = (localStorage.getItem('itensCart'));
  if (cart) {
    itensCart.outerHTML = cart;
  }
}

window.onload = function onload() {
  fetchItens();
  clear();
  loadingItensCartOfLocalStorage();
};
