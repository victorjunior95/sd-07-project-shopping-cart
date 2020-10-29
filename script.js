const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const itemsSection = document.querySelector('.items');

const ol = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  const father = event.target.parentNode;
  const children = event.target;
  father.removeChild(children);
}

function createCartItemElement(parameter) {
  const li = document.createElement('li');
  li.className = 'cart__item';

  if (typeof parameter === 'string') li.innerText = parameter;
  else {
    const { id: sku, title: name, price: salePrice } = parameter;
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  }

  li.addEventListener('click', cartItemClickListener);

  return li;
}

async function fetchAPI(api) {
  return fetch(api).then(response => response.json());
}

const addProducts = (product, tag) => tag.appendChild(product);

function addLocalStorage(string) {
  if (localStorage.getItem('items')) {
    const arrayItems = JSON.parse(localStorage.getItem('items'));
    arrayItems.push(string);
    localStorage.setItem('items', JSON.stringify(arrayItems));
  } else {
    const listOfItems = [string];
    localStorage.setItem('items', JSON.stringify(listOfItems));
  }
}

const clearLocalStorage = () => localStorage.clear();

async function consultProduct(supply) {
  const API = `${API_URL}${supply}`;
  await fetchAPI(API)
    .then(data => data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      addProducts(item, itemsSection);
    }))
    .catch(err => err);
}

function loadShoppingCart() {
  if (localStorage.getItem('items')) {
    const arrayItems = JSON.parse(localStorage.getItem('items'));
    arrayItems.forEach((item) => {
      const itemList = createCartItemElement(item);
      addProducts(itemList, ol);
    });
  }
}

async function addProductToCart(id) {
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  await fetchAPI(endPoint)
    .then((data) => {
      const li = createCartItemElement(data);
      addLocalStorage(li.innerText);
      addProducts(li, ol);
    })
    .catch(err => alert(err));
}

itemsSection.addEventListener('click', function (event) {
  if (event.target.className === 'item__add') {
    const father = event.target.parentNode;
    const id = father.firstChild.innerText;
    addProductToCart(id);
  }
});


document.querySelector('.empty-cart').addEventListener('click', function () {
  ol.innerText = '';
  clearLocalStorage();
});

window.onload = function onload() {
  consultProduct('computador');
  loadShoppingCart();
};
