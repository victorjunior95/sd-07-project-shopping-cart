const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  endpoint: 'computador',
};
const url = `${apiInfo.api}${apiInfo.endpoint}`;


  // const setupEvent = () => {
  //  const searchBtn = document.querySelector('#search');
  // searchBtn.addEventListener('click', cartItemClickListener);
  // }

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

const addItens = (itemFromArray) => {
  const item = Object.entries(itemFromArray);
  item.forEach(entry => document.querySelector('.items').appendChild(createProductItemElement(entry[1])));
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const endpoint = `${url}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(object => addItens(object.results));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  // setupEvent();
  cartItemClickListener(event);
};
