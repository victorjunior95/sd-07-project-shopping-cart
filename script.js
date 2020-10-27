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
  // coloque seu código aqui!
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProducts = (product, tag) => {
  tag.appendChild(product);
};

function consultProduct(supply) {
  const API = `${API_URL}${supply}`;
  fetch(API)
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      addProducts(item, itemsSection);
    });
  })
  .catch(reject => console.log(reject));
}

function addProductToCart(id) {
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endPoint)
  .then(response => response.json())
  .then(data => {
    const { id: sku, title: name, price: salePrice } = data;
    const li = createCartItemElement({ sku, name, salePrice });
    addProducts(li, ol);
  })
  .catch(reject => console.log(reject))
}

itemsSection.addEventListener('click', function(event) {
  if (event.target.className === 'item__add') {
    const father = event.target.parentNode;
    const id = father.firstChild.innerText;
    addProductToCart(id);
  }
});

window.onload = function onload() { consultProduct('computador'); };
