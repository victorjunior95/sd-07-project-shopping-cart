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
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// My code bellow ----------------------------------------------------------------------------
function cartPlacer(data) {
  const shoppingCart = document.querySelector('.cart__items');
  item = createCartItemElement(data);
  shoppingCart.appendChild(item);
}

function addToCart(event) {
  const url = 'https://api.mercadolibre.com/items/';
  const parentEvent = event.target.parentNode;
  const sku = getSkuFromProductItem(parentEvent);
  const endpoint = `${url}${sku}`;
  const method = 'cartPlacer';
  fetchSearch(endpoint, method);
}

function storePlacer(data) {
  const store = document.querySelector('.items');
  items = data.results;
  items.forEach((item) => {
    const product = createProductItemElement(item);
    const btnAddCart = product.querySelector('button');
    btnAddCart.addEventListener('click', addToCart);
    store.appendChild(product);
  });
}

function methodCatcher(data, method) {
  if (method === 'cartPlacer') {
    cartPlacer(data);
  }
  if (method === 'storePlacer') {
    storePlacer(data);
  }
}

function fetchSearch(endpoint, method) {
  fetch(endpoint)
    .then((response) => {
      response.json()
        .then((data) => {
          methodCatcher(data, method);
        });
    }).catch(error => console.log(error));
}

function defaultSearch(term, method) {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const endpoint = `${url}${term}`;
  fetchSearch(endpoint, method);
}

window.onload = function onload() {
  defaultSearch('COMPUTADOR', 'storePlacer');
};
