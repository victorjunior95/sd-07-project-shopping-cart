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

function cartItemClickListener(event) {
  // My code bellow
  const item = event.target;
  item.parentNode.removeChild(item);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// My code bellow ----------------------------------------------------------------------------
async function sumCartPrices({ price }) {
  try {
    const spanPrice = document.querySelector('span.total-price');
    let totalPrice = parseFloat(spanPrice.innerText);
    console.log(spanPrice);
    console.log(totalPrice);
  } catch (error) {
    console.log(error);
  }
}

function cartPlacer(data) {
  const shoppingCart = document.querySelector('.cart__items');
  let item = createCartItemElement(data);
  shoppingCart.appendChild(item);
  item = item.innerHTML;
  sumCartPrices(data);
}

function addToCart(event) {
  const url = 'https://api.mercadolibre.com/items/';
  const parentEvent = event.target.parentNode;
  const sku = getSkuFromProductItem(parentEvent);
  const endpoint = `${url}${sku}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(data => cartPlacer(data));
}

function storePlacer(data) {
  const store = document.querySelector('.items');
  const items = data.results;
  items.forEach((item) => {
    const product = createProductItemElement(item);
    const btnAddCart = product.querySelector('button');
    btnAddCart.addEventListener('click', addToCart);
    store.appendChild(product);
  });
}

function defaultSearch(term) {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const endpoint = `${url}${term}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(data => storePlacer(data));
}

window.onload = function onload() {
  defaultSearch('COMPUTADOR');
};
