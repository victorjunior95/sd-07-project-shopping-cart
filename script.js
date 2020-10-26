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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const manageCart = (object) => {
  const cart = document.querySelector('.cart__items');
  const product = {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
  };
  cart.appendChild(createCartItemElement(product));
};

const fetchInfoFromId = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(object => manageCart(object));
};

function cartItemClickListener(event) {
  const item = event.target.parentElement;
  const sku = getSkuFromProductItem(item);
  fetchInfoFromId(sku);
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

const listenBtn = () => {
  const btnItem = document.querySelectorAll('.item__add');
  btnItem.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      cartItemClickListener(event);
    });
  });
};
const fetchItemsMercadoLivre = (term) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  fetch(endpoint)
  .then(response => response.json())
  .then(object => manageItems(object.results))
  .then(() => listenBtn());
};


window.onload = function onload() {
  fetchItemsMercadoLivre('computador');
};
