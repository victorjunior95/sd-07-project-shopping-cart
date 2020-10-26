function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchingAPIById(itemId) {
  return fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json());
}

function appendElement(container, callback, elements) {
  return container.appendChild(callback(elements));
}

function addEventButton(element) {
  element.addEventListener('click', () => {
    const itemId = getSkuFromProductItem(event.target.parentElement);
    const cartItemsContainer = document.querySelector('.cart__items');
    const item = fetchingAPIById(itemId);
    item
      .then((data) => {
        const dataElements = { sku: data.id, name: data.title, salePrice: data.price };
        appendElement(cartItemsContainer, createCartItemElement, dataElements);
      });
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') addEventButton(e);
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

function listingProducts() {
  const productsContainer = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(data => data.results.forEach((product) => {
    const productElements = { sku: product.id, name: product.title, image: product.thumbnail };
    productsContainer
    .appendChild(
      createProductItemElement(productElements),
      );
  }));
}

window.onload = function onload() {
  listingProducts();
};
