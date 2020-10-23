window.onload = function onload() { 
  const SEARCH_TERM = 'computador';
  fillProductListByTerm(SEARCH_TERM);
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const showAlert = (message) => {
  window.alert(message);
}

const fetchMLProductListByTerm = async (term) => {
  const API_URL_ML_SEARCH = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  try {
    const response = await fetch(API_URL_ML_SEARCH);
    const jsonObject = await response.json(); 
    const { results } = jsonObject;
    return results;
  } catch (error) {
    showAlert(error);
  }
}

const fillProductListByTerm = async (term) => {
  try {
    const productList = await fetchMLProductListByTerm(term);
    productList
      .map(({id, title, thumbnail}) => ({ sku: id, name: title, image: thumbnail}))
      .forEach(product => {
        const sectionItems = document.querySelector(".items");
        sectionItems.appendChild(createProductItemElement(product));
      });
  } catch (error) {
    showAlert(error);
  }
}