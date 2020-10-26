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

function appendItems(section) {
  const listOfItems = document.querySelector('.items');
  listOfItems.appendChild(section);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  appendItems(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleSearchResults(results) {
  const filteredResults = {};
  results.forEach((entry) => {
    filteredResults.sku = entry.id;
    filteredResults.name = entry.title;
    filteredResults.image = entry.thumbnail;
    createProductItemElement(filteredResults);
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
