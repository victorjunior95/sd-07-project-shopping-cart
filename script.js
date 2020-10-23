window.onload = function onload() {
  fetchCurrency('computador');
};

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

const handleProducts = (data) => {
  const productsEntries = data.results;
  const listProducts = document.getElementsByClassName('items')[0];
  const newDiv = document.createElement('div');
  productsEntries.forEach((product) => {
    listProducts.appendChild(newDiv);
    newDiv.innerHTML = product.title;
  })
}

const fetchCurrency = (currency) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${currency}`;

  fetch (endpoint)
    .then((response) => response.json())
    .then((data) => console.log(data.results))
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
