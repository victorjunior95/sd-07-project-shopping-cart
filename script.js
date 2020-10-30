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
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ---------------------------------------------------------------------
function storePlacer(data) {
  const store = document.querySelector('.items');
  items = data.results;
  items.forEach((item) => {
    const product = createProductItemElement(item);
    store.appendChild(product);
  });
}

function fetchSearch(endpoint, method) {
  fetch(endpoint)
    .then((response) => {
      response.json()
        .then((data) => {
          if (method === 'storePlacer') {
            storePlacer(data);
          }
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
