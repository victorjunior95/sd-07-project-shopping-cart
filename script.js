window.onload = function onload() { 
  fetchProductsFromApi();
  setupEventHandlers();
};

const setupEventHandlers = () => {
  const searchButton = document.querySelector('.search_button');
  searchButton.addEventListener('click', handlerSearchEvent);
}

const handlerSearchEvent = () => {
  const currency = document.querySelector('#search_item').value;
  cleanList();
  return fetchProductsFromApi(currency);
}

const cleanList = () => {
  const sectionList = document.querySelector('.items');
  sectionList.innerHTML = '';
}
 
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchProductsFromApi(currency = 'computador') {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${currency}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const itens = await object.results;
  return loadItems(itens);
}

function iterateProduct(product) {
  const { id: sku, title: name, thumbnail: image, price: salePrice } = product;
  const avalibleProduct = { sku, name, image, salePrice };
  return avalibleProduct;
}

function loadItems(itens) {
  const itensList = itens;
  itensList.forEach(product => {
    const item = iterateProduct(product);
    const listItens = document.querySelector('.items');
    listItens.appendChild(createProductItemElement(item));
  });
}