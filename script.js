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

function itemObjectCreate(keys, item) {
  const itemObj = {};
  keys.forEach((key) => { itemObj[key] = item[key]; });
  return itemObj;
}

function cartItemClickListener(event) {
  event.srcElement.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handlerEventClick(event) {
  if (event.target.className === 'item__add') {
    const itemId = getSkuFromProductItem(event.path[1]);
    const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
    fetch(endpoint)
      .then(response => response.json())
      .then(item => document.querySelector('.cart__items').appendChild(
          createCartItemElement(itemObjectCreate(['id', 'title', 'price'], item))));
  }
  if (event.target.className === 'empty-cart') {
    document.querySelector('.cart__items').innerHTML = '';
  }
}

function fectchItemSearch(itemQuery) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${itemQuery}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach(item =>
        document.querySelector('.items').appendChild(
          createProductItemElement(itemObjectCreate(['id', 'title', 'thumbnail'], item))));
    });
}

window.onload = function onload() {
  const itemQuery = 'computador';

  fectchItemSearch(itemQuery);
  document.onclick = handlerEventClick;
};
