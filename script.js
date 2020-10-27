function showAlert(message) {
  window.alert(message);
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

function cartItemClickListener(event) {
// Colocar código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.sku = sku;
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function fetchProductsFromApi() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    return object.results;
  } catch (error) {
    showAlert(error);
  }
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addToCart);
  section.dataset.sku = sku;
  return section;
}

async function fetchItemForCart(itemID) {
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    return object;
  } catch (error) {
    showAlert(error);
  }
}

function handleCartItem(item) {
  const cartItem = {};
  cartItem.sku = item.id;
  cartItem.name = item.title;
  cartItem.salePrice = item.price;
  return cartItem;
}

async function addToCart() {
  const itemID = this.closest('.item').dataset.sku;
  const item = await fetchItemForCart(itemID);
  const handledItem = handleCartItem(item);
  console.log(handledItem);
  const cart = document.querySelector('.cart');
  cart.appendChild(createCartItemElement(handledItem));
}

function handleProducts(product) {
  const handledProduct = {};
  handledProduct.sku = product.id;
  handledProduct.name = product.title;
  handledProduct.image = product.thumbnail;
  return handledProduct;
}

async function loadItems() {
  const fetchedProducts = await fetchProductsFromApi();
  fetchedProducts.forEach((product) => {
    const item = handleProducts(product);
    const listOfItems = document.querySelector('.items');
    listOfItems.appendChild(createProductItemElement(item));
  });
}

window.onload = function onload() {
  loadItems();
};
