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

const updateLocalStorage = () => {
  const cartUpdated = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartUpdated);
};

function cartItemClickListener(event) {
  const liToRemove = event.target;
  liToRemove.remove();
  updateLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const updateTotalPrice = async (price) => {
  const spanWithActualPrice = document.querySelector('#total_price');
  const actualTotalPrice = parseFloat(spanWithActualPrice.innerText);
  console.log(actualTotalPrice);
  console.log(price);
  const newTotalPrice = actualTotalPrice + price;
  localStorage.setItem('totalPrice', newTotalPrice);
  spanWithActualPrice.innerText = newTotalPrice.toFixed(2);
};

const manageCart = (object) => {
  const cart = document.querySelector('.cart__items');
  const product = {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
  };
  cart.appendChild(createCartItemElement(product));
  updateLocalStorage();
  updateTotalPrice(product.salePrice);
};

// const fetchFromStorage = (sku) => {
  //   const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  //   fetch(endpoint)
  //   .then(response => response.json())
  //   .then(object => manageCart(object));
// };

const fetchInfoFromId = () => {
  const item = event.target.parentElement;
  const sku = getSkuFromProductItem(item);
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  fetch(endpoint)
  .then(response => response.json())
  .then(object => manageCart(object));
};
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', event => fetchInfoFromId(event));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  return section;
}

const manageItems = (resultsArray) => {
  const itemsSection = document.querySelector('.items');
  resultsArray.forEach((item) => {
    const product = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    itemsSection.appendChild(createProductItemElement(product));
  });
};

const fetchItemsMercadoLivre = (term) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(object => manageItems(object.results));
};

const recoverCart = () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart');
  const listItems = cart.querySelectorAll('li');
  for (let index = 0; index < listItems.length; index += 1) {
    listItems[index].addEventListener('click', cartItemClickListener);
  }
  updateTotalPrice(parseFloat(localStorage.getItem('totalPrice')));
};


window.onload = function onload() {
  fetchItemsMercadoLivre('computador');
  recoverCart();
};
