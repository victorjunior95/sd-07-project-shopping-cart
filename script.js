window.onload = function onload() { };

const fetch = require('node-fetch');

const showAlert = (error) => {
  window.alert(error);
};

const getProductsList = async (term) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  try {
    const response = await fetch(url);
    const object = await response.json();
    const { results } = await object.results;
    return results;
  } catch (error) {
    return showAlert(error);
  }
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

const createProductSessions = async (term) => {
  try {
    const productsList = await getProductsList(term);
    const sectionItems = document.getElementsByClassName('items');
    productsList.map(({ id, title, thumbnail }) => ({ sku: id, name: title, image: thumbnail }))
    .forEach((item) => {
      const productItemElement = createProductItemElement(item);
      sectionItems.appendChild(productItemElement);
    });
  } catch (error) {
    showAlert(error);
  }
};

const searchTerm = 'computador';
createProductSessions(searchTerm);

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
