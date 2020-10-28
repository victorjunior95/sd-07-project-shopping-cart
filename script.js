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

function cartItemClickListener(event) {
  const cartOl = document.querySelector('.cart__items');
  cartOl.removeChild(event.target);
  console.log(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addingToCart(product) {
  const API_URL = `https://api.mercadolibre.com/items/${product}`;
  console.log(API_URL);
  const cartOl = document.querySelector('.cart__items');
  fetch(API_URL)
  .then(response => response.json())
  .then((element) => {
    const { id: sku, title: name, price: salePrice } = element;
    cartOl.appendChild(createCartItemElement({ sku, name, salePrice }));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addItemButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addItemButton.addEventListener('click', function (event) {
    const product = event.target.parentNode;
    getSkuFromProductItem(product);
    addingToCart(getSkuFromProductItem(product));
  });
  section.appendChild(addItemButton);
  return section;
}

const generateProducts = () => {
  // Abstração facilitada pelo colega Vitor Rodrigues
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const itemsSection = document.querySelector('.items');
  fetch(API_URL)
  .then(response => response.json())
  .then((item) => {
    item.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const eachItem = createProductItemElement({ sku, name, image });
      itemsSection.appendChild(eachItem);
    });
  });
};

window.onload = function onload() {
  generateProducts();
};
