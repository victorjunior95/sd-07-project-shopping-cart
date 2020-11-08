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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductToCart(product) {
  const cart = document.querySelector('.cart__items');
  const { id, title, price } = product;
  cart.appendChild(createCartItemElement({
    name: title,
    salePrice: price,
    sku: id,
  }));
}

async function fetchById(productId) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
    const product = await response.json();
    return product;
  } catch (error) {
    return window.alert('Product not founded');
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function recoverProduct(e) {
  const productId = getSkuFromProductItem(e.target.parentNode);
  const product = await fetchById(productId);
  addProductToCart(product);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', recoverProduct);
  section.appendChild(button);
  return section;
}

function appendElementsToPage(elements) {
  const itemSection = document.querySelector('.items');
  elements.forEach((element) => {
    const { id, title, thumbnail } = element;
    itemSection.appendChild(createProductItemElement({
      sku: id,
      image: thumbnail,
      name: title,
    }));
  });
}

async function fetchItems(term) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`);
    const items = await response.json().then(data => data.results);
    appendElementsToPage(items);
  } catch (error) {
    window.alert(error);
  }
}

window.onload = function onload() {
  fetchItems('computador');
};
