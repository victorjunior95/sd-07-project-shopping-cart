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

const addLocalStorage = () => {
  const object = [];
  const li = document.querySelectorAll('.cart__item');
  li.forEach(courrentItem => object.push(courrentItem.innerText));
  localStorage.setItem('shopping cart', JSON.stringify(object));
};

function cartItemClickListener(event) {
  event.target.remove();
  addLocalStorage();
}

const addLoading = () => {
  document.querySelector('.container').appendChild(
    createCustomElement('h1', 'loading', 'loading...'));
};

const removeLoading = () => {
  document.querySelector('.loading').remove();
};

const cleanCart = () => {
  const cleanButton = document.querySelector('.empty-cart');
  const cart = document.querySelector('.cart__items');
  localStorage.clear();
  cleanButton.addEventListener('click', () => {
    cart.innerHTML = '';
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProductsOnCart = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((item) => {
      document.querySelector('.cart__items').appendChild(createCartItemElement(item));
    });
  addLocalStorage();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', ((event) => {
    const parentElement = event.target.parentElement;
    addProductsOnCart(getSkuFromProductItem(parentElement));
  }));
  section.appendChild(button);
  return section;
}

const loadProducts = (search) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  const list = document.querySelector('.items');
  addLoading();
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        const item = createProductItemElement({ sku, name, image });
        list.appendChild(item);
      });
      removeLoading();
    });
};

const loadLocalStorage = () => {
  const ol = document.querySelector('.cart__items');
  const storageItems = JSON.parse(localStorage.getItem('shopping cart'));
  if (storageItems) {
    storageItems.forEach((item) => {
      const li = createCustomElement('li', 'cart__item', item);
      ol.appendChild(li);
    });
  }
};

window.onload = function onload() {
  loadProducts('computador');
  cleanCart();
  loadLocalStorage();
};
