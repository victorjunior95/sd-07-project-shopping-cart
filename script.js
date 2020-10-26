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

function appendItemsToList(section) {
  const listOfItems = document.querySelector('.items');
  listOfItems.appendChild(section);
}

function appendItemsToCart(li) {
  const listOfItems = document.querySelector('.cart__items');
  listOfItems.appendChild(li);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.dataset.sku = sku;
//  console.log(li);
  return li;
}

function handleCartItem(item) {
  const filteredItem = {};
  // results.forEach((entry) => {
  filteredItem.sku = item.id;
  filteredItem.name = item.title;
  filteredItem.salePrice = item.price;
  console.log(filteredItem);
  appendItemsToCart(createCartItemElement(filteredItem));
}

async function fetchItemForCart(itemID) {
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    handleCartItem(object);
  } catch (error) {
    showAlert(error);
  }
}

function cartItemClickListener(event) {
  const itemID = this.closest('.item').dataset.sku;
  fetchItemForCart(itemID);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', cartItemClickListener);
  section.dataset.sku = sku;
  appendItemsToList(section);
  // return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function handleSearchResults(results) {
  const filteredResult = {};
  results.forEach((entry) => {
    filteredResult.sku = entry.id;
    filteredResult.name = entry.title;
    filteredResult.image = entry.thumbnail;
    createProductItemElement(filteredResult);
  });
}

async function fetchItemsFromApi() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const object = await response.json();
    handleSearchResults(object.results);
  } catch (error) {
    showAlert(error);
  }
}

window.onload = function onload() {
  fetchItemsFromApi();
};
