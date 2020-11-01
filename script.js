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
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const requestProductToCart = (event) => {
  const item = event.target.parentNode;
  const itemId = getSkuFromProductItem(item);
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;

  fetch(endpoint).then(res => res.json().then((data) => {
    const ordenedList = document.querySelector('.cart__items');
    const { id: sku, title: name, price: salePrice } = data;
    const itemCart = createCartItemElement({ sku, name, salePrice });
    ordenedList.appendChild(itemCart);
  }));
};

const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(endpoint).then(res => res.json().then((content) => {
    const itensContent = document.querySelector('.items');
    content.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      item.querySelector('.item__add').addEventListener('click', requestProductToCart);
      itensContent.appendChild(item);
    });
  }));
};

window.onload = function onload() {
  loadProducts();
};
